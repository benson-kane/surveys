var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency



/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('surveysHome.html', { root: 'public' });
});









/* Set up mongoose in order to connect to mongo database */


mongoose.connect('mongodb://localhost/commentDB',{ useNewUrlParser: true }); //Connects to a mongo database called "commentDB"

var submissionSchema = mongoose.Schema({ //Defines the Schema for this database
    submissionDate: {type: Date, default: Date.now()},
    userIP: String,
    userGender: String,
    favColor: String
});

var Submission = mongoose.model('Submission', submissionSchema); //Makes an object from that schema as a model

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected to mongoose');
});

module.exports = router;



router.post('/submission', function(req, res) {
    console.log("POST submission route");
    console.log(req.body); 
    var newSubmission = new Submission(req.body);
    newSubmission.userIP = req.ip;
    console.log(newSubmission); 
    newSubmission.save(function(err, post) { 
        if (err) return console.error(err);
        
        console.log(post);
        res.sendStatus(200);
    });
});

router.get('/submission', function(req, res, next) {
    console.log("GET submission route");
    Submission.find(function(err,submissionList) { //Calls the find() method on your database
      if (err) return console.error(err); //If there's an error, print it out
      else {
        console.log(submissionList); //Otherwise console log the comments you found
      }
      res.json(submissionList);
    })
});