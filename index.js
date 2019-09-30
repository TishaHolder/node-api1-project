// implement your API here

//require the yarn express module
const express = require ('express');

//creates an express application using the express module
const server = express();

//import the db.js file to get access to the DB 
const DB = require('./data/db.js');

//configures server for every get request to /
server.get('/', (res, req) => {

    res.send('Welcome to the Users Database');

});

//configures server for every get request to /users
server.get('/users', (res, req) => {

    //calling find returns a promise that resolves to an array of all the users contained in the database.
    DB.find()
    .then(db => {
        //.json will convert the data passed to JSON
        //also tells the client we're sending JSON through the HTTP header
        res.status(200).json(db);

    })
    .catch(error => {
        //if there is an error retrieving the users from the database
        //cancel the request and respond with HTTP status code 500
        //return the followig error message
        res.status(500).json({message: 'The users information could not be retrieved.'});
    })    

});

server.get('/users/:id', (res, req) => {

    //findById() expects an id as it's only parameter and returns the user corresponding to the id provided
    DB.findById(id)
    .then(db => {
        res.status(200).json(db);

    })
    .catch(error => {
        res.status(500).json({message: 'The user with the specified ID does not exist.'});
    })

});

//creates a user using the information sent inside the request body.
server.post('/users', (res, req) => {

    const dbInformation = req.body;

    

    DB.insert(dbInformation)
    
    .then(db => {
        if(dbInformation.name === "" || dbInformation.bio === ""){

            res.status(400).json({message: 'Please provide name and bio for the user.'});
    
        }
        else {

            res.status(201).json(db);
        }
    })
    .catch(error => {
        res.status(500).json({message: 'There was an error while saving the user to the database.'});
    })

});

const port = 5000;
server.listen(port, () => console.log(`API running on port ${port}`));