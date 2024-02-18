const { ApolloServer } = require('apollo-server');
const express = require('express');
// other imports...
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Apollo server
const typeDefs= require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const Server = new ApolloServer({
    typeDefs,
    resolvers, introspection: true, // Enable introspection
    playground: true, // Enable the GraphiQL UI
});

const PORT = process.env.PORT || 4000;

//DB connection string
const DB_URL = "mongodb+srv://allanissumaya22:Allanismongopass22@cluster0.zap8277.mongodb.net/comp3133_Assignment1?retryWrites=true&w=majority"

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Successfully connected to the database");
        return Server.listen({port: PORT});
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    });
