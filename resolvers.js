const Employee = require("./models/EmployeeModel");
const User = require("./models/UserModel");

exports.resolvers = {
    Query: {
        getEmployees: async (parent, args) => {
            return await Employee.find({});
        },
        getEmployeeByID: async (parent, args) => {
            return await Employee.findById(args.id);
        },
        login: async (parent, args) => {
            try {
                const userData = await User.findOne({
                    username: args.username,
                });

                if (userData != null && args.password != null) {
                    if (args.password == userData.password) {
                        return {
                            status: true,
                            username: userData.username,
                            message: `User (username:${userData.username}) logged in successfully`,
                        };
                    } else {
                        return {
                            status: false,
                            message: "Invalid Username and password",
                        };
                    }
                } else {
                    return {
                        status: false,
                        message:
                            "User Not Found. Please enter correct username & password",
                    };
                }
            } catch (error) {
                return {
                    message: "Something went wrong while logging",
                    status: false,
                    error: error,
                };
            }
        },
    },

    Mutation: {
        addEmployee: async (parent, args) => {
            try {
                let newEmp = new Employee({
                    first_name: args.first_name,
                    last_name: args.last_name,
                    email: args.email,
                    gender: args.gender,
                    salary: args.salary,
                });
                const emp = await newEmp.save();
                if (emp) {
                    return {
                        message: "Employee Successfully created.",
                        status: true,
                        employee: emp,
                    };
                }
            } catch (error) {
                if (error.code === 11000) {
                    return {
                        message:
                            "Employee already exists with same email. please write different email.",
                        status: false,
                    };
                } else {
                    return {
                        message:
                            "Something went wrong while creating new employee.",
                        status: false,
                        error: error,
                    };
                }
            }
        },
        updateEmployee: async (parent, args) => {
            if (!args.id) {
                return {
                    message: "Please enter employee id to update.",
                    status: false,
                };
            }
            try {
                const updatedEmployee = await Employee.findOneAndUpdate(
                    {
                        _id: args.id,
                    },
                    {
                        $set: {
                            first_name: args.first_name,
                            last_name: args.last_name,
                            email: args.email,
                            gender: args.gender,
                            salary: args.salary,
                        },
                    },
                    { new: true }
                );
                if (!updatedEmployee)
                    return {
                        message: "No Employee found.",
                        status: false,
                    };
                else
                    return {
                        message: `${args.id} updated successfully.`,
                        status: true,
                        employee: updatedEmployee,
                    };
            } catch (error) {
                return {
                    message: "Something went wrong while updating employee.",
                    status: false,
                    error: error,
                };
            }
        },

        deleteEmployee: async (parent, args) => {
            if (!args.id) {
                return {
                    message: "Please enter id to delete employee.",
                    status: false,
                };
            }
            try {
                const employee = await Employee.findByIdAndDelete(args.id);
                if (!employee)
                    return {
                        status: false,
                        message: "No Employee Found",
                    };
                else
                    return {
                        status: true,
                        message: `${args.id} deleted successfully.`,
                    };
            } catch (error) {
                return {
                    message: "Something went wrong while deleting employee.",
                    status: false,
                    error: error,
                };
            }
        },

        signup: async (parent, args) => {
            try {
                const newUser = new User({
                    username: args.username,
                    email: args.email,
                    password: args.password,
                });
                const user = await newUser.save();
                if (user) {
                    return {
                        message: "User Successfully created.",
                        status: true,
                        user: user,
                    };
                }
            } catch (error) {
                if (error.code == 11000) {
                    return {
                        status: false,
                        message: "User already exists with the same email",
                    };
                } else {
                    return {
                        message:
                            "Something went wrong while creating new user.",
                        status: false,
                        error: error,
                    };
                }
            }
        },
    },
};
