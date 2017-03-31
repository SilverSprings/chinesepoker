const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');

// using http://deckofcardsapi.com/

router.get('/newdeck', (req, res) => {
	console.log('api newdeck');
	axios.get('http://127.0.0.1:8000/api/deck/new/shuffle/?deck_count=1')
		 .then(deck => {console.log(deck.data);
						res.status(200).json(deck.data);
		 })
		 .catch(error => {res.status(500).send(error)});
});

router.post('/newhand', (req, res) => {
	console.log('api newhand', req.body);
	axios.get('http://127.0.0.1:8000/api/deck/'+req.body.deck_id+'/draw/?count=13')
		 .then(hand => {console.log(hand.data);
						res.status(200).json(hand.data);
		 })
		 .catch(error => {res.status(500).send(error)});
});













/*


// mongoDB part
var MongoObjectID = require("mongodb").ObjectID; 

var MongoClient = require("mongodb").MongoClient;

var db;
var coll;

MongoClient.connect("mongodb://127.0.0.1/game", function(error, datab) {
	if (error) console.log("ERREUR : " + error);
	db = datab;
	coll = db.collection("posts");
	console.log ('connexion mongoDB réussie');
});

/* GET api listing. 
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all posts
router.get('/posts', (req, res) => {
	coll.find().toArray((err, results) => {
		if (err) throw err;
		console.log('find all posts ok');
		res.status(200).send(results);
	});
});


// delete a post
router.delete('/removePost', (req, res) => {
	console.log('In the delete function', req.body);
	console.log(req.body._id);
	x = new MongoObjectID(req.body._id);
	console.log(x);
	coll.remove({_id:x}, null, (err, result) => {
		if (err) throw err;
		console.log('remove ok');
		coll.find().toArray((err, results) => {
			if (err) throw err;
			console.log('find all posts ok');
			res.status(200).send(results);
		});	
	});
});

// add a post or update
router.post('/addPost', (req, res) => {
	console.log('In the add function', req.body);
	coll.save(req.body, null, (err, result) => {
		if (err) throw err;
		console.log('add ok');
		coll.find().toArray((err, results) => {
			if (err) throw err;
			console.log('find all posts ok');
			res.status(200).send(results);
		});	
	});
});

// add a post or update
router.post('/updPost', (req, res) => {
	req.body._id = new MongoObjectID(req.body._id);
	console.log('In the upd function', req.body);
	coll.save(req.body, null, (err, result) => {
		if (err) throw err;
		console.log('upd ok');
		coll.find().toArray((err, results) => {
			if (err) throw err;
			console.log('find all posts ok');
			res.status(200).send(results);
		});	
	});
});
*/

// permet à ce que ce fichier devienne un module et soit utiliser par d'autres qui l'appelleront grâce à require
module.exports = router;