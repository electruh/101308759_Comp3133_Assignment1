const employee = require('../model/employee');
const user = require('../model/user');

const resolvers = {
    Mutation: {
        // Creating a user
        async createUser(_, { userInput: { username, password, email } }) {
            const newUser = await user.create({
                username,
                password,
                email
            });
            return { username: newUser.username, email: newUser.email };
        },

        // Creating an employee
        async createEmployee(_, { employeeInput: { first_name, last_name, email, gender, salary } }) {
            try {
                const newEmployee = await employee.create({
                    first_name,
                    last_name,
                    email,
                    gender: gender.toLowerCase(),
                    salary
                });
                return { first_name: newEmployee.first_name, last_name: newEmployee.last_name, email: newEmployee.email, gender: newEmployee.gender, salary: newEmployee.salary };
            } catch (error) {
                // Handle duplicate key error (E11000) for unique fields like email
                if (error.code === 11000) {
                    throw new Error('Employee with the same email already exists');
                }
                // Handle other errors
                throw new Error('Employee creation failed');
            }
        },

        // Updates employee using ID
        async updateEmployee(_, { ID, employeeInput: { first_name, last_name, email, salary, gender } }) {
            const updatedEmployee = await employee.findByIdAndUpdate(ID, {
                first_name,
                last_name,
                email,
                salary,
                gender
            }, { new: true });
            return { first_name: updatedEmployee.first_name, last_name: updatedEmployee.last_name, email: updatedEmployee.email, salary: updatedEmployee.salary, gender: updatedEmployee.gender };
        },

        // Deletes employee using ID
        async deleteEmployee(_, { ID }) {
            try {
                await employee.findByIdAndDelete(ID);
                return true;
            } catch (err) {
                return false;
            }
        }
    },

    Query: {
        // Displays all users
        async getUsers() {
            try {
                const users = await user.find();
                return users;
            } catch (err) {
                return {
                    message: "Error fetching all users",
                };
            }
        },

        // Displays all employees
        async getEmployees() {
            try {
                const emps = await employee.find();
                return emps;
            } catch (err) {
                return {
                    message: "Error fetching all employees",
                };
            }
        },

        // Allows user to login by using username and password
        async login(_, { loginInput: { username, password } }) {
            const foundUser = await user.findOne({ username, password });

            if (!foundUser) {
                // User not found
                throw new Error('User not found');
            } else {
                // User found
                return foundUser;
                return {
                    message: "successfully logged in",
                }
            }
        },

        // Displays an employee using ID
        async employeeID(_, { ID }) {
            const foundEmployee = await employee.findById(ID);
            if (!foundEmployee) {
                throw new Error(`Employee with ID ${ID} not found`);
            }
            return foundEmployee;
        }
    }
};

// Export the resolvers
module.exports = resolvers;
