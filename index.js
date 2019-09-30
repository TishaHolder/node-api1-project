// implement your API here

//require the yarn express module
const express = require ('express');

//creates an express application using the express module
const server = express();

//middleware
//need this for post and put - teaches express how to read json from the request body
server.use(express.json()); 

//import the db.js file to get access to the DB 
const DB = require('./data/db.js');

//configures server for every get request to /
//request comes first followed by the response
server.get('/', (req, res) => {

    res.send('Welcome to the Users Database');

});

//configures server for every get request to /users
server.get('/users', (req, res) => {

    //calling find returns a promise that resolves to an array of all the users contained in the database.
    DB.find()
    .then(users => {
        //.json will convert the data passed to JSON
        //also tells the client we're sending JSON through the HTTP header
        res.status(200).json(users);

    })
    .catch(error => {
        //if there is an error retrieving the users from the database
        //cancel the request and respond with HTTP status code 500
        //return the followig error message
        res.status(500).json({message: 'The users information could not be retrieved.'});
    })    

});

server.get('/users/:id', (req, res) => {

    //params is an object with all the url parameters
    const userId = req.params.id;

    //findById() expects an id as it's only parameter and returns the user corresponding to the id provided
    DB.findById(userId)
    .then(users => {
        res.status(200).json(users);

    })
    .catch(error => {
        res.status(500).json({message: 'The user with the specified ID does not exist.'});
    })

});

//creates a user using the information sent inside the request body.
server.post('/users', (req, res) => {

    const userInformation = req.body;    

    DB.insert(dbInformation)    
    .then(users => {
        if(userInformation.name === "" || userInformation.bio === ""){

            res.status(400).json({message: 'Please provide name and bio for the user.'});    
        }
        else {

            res.status(201).json(dbInformation);
        }
    })
    .catch(error => {

        res.status(500).json({message: 'There was an error while saving the user to the database.'});
    })

});

//Removes the user with the specified id and returns the deleted user.
server.delete('/users/:id', (req, res) => {

    const userId = req.params.id;

    DB.remove(userId)
    .then(users => {
        if(userId) {
            res.status(200).json(users);
        }
        else {

            res.status(404).json({message: 'The user with the specified ID does not exist.'});
        }        

    })
    .catch(error => {
        res.status(500).json({message: 'The user could not be removed.'});
    })

});

//Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.
server.put('/users/:id', (req, res) => {

    const userId = req.params.id;
    const userInformation = req.body;
    
    if(!userId){

        res.status(404).json({message: 'The user with the specified ID does not exist.'})
    }
    if (userInformation.name === "" || userInformation.bio === "") {

        res.status(400).json({message: 'Please provide name and bio for the user.'});

    }
    else {
        DB.update(userId, userInformation)
        .then(users => {

            res.status(200).json({users});

        })
        .catch (error => {

            res.status(500).json({message: 'The user information could not be modified'});
        })
    }

});

const port = 5000;
server.listen(port, () => console.log(`API running on port ${port}`));