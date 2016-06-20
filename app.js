//1. Require in Modules
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

//invoke the express module
var app = express();

//2. Set the view engine, path to views, and use body-parser
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/CSS'));
// body-parser for url encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//3. Set up for Postgress
// postgres db setup
var promise = require('bluebird');
var options = {
	promiseLib: promise
};
var pgp = require('pg-promise')(options);
// create an instance of the database
var db = pgp('postgres://localhost:5432/todo_app');

//4. Set up server and one route 
app.get('/',function(req,res){
 res.send('All systems go test!');
})

//"users"ROUTES"BELOW
/* "/users"
 * GET: finds all users
 * POST: creates a new user
 */
app.get('/things', function(req,res,next){
	db.any('SELECT * FROM todo')
	.then(function (data) {
		res.render('index', {data:data});
 	})
		.catch(function (err) {
			return next(err);
		});
});

app.post('/things',function(req,res,next){   
var newUser = req.body;   // expects no rows   
db.none('INSERT INTO todo(thing_to_do)'+     
	'values(${thing_to_do})',     
	req.body)  
	 .then(function(){     
	 	res.redirect('/things');   
	 })   
	 .catch(function (err){     
	 	return next(err);  
	 }); 
});

/* "/users/:id"
 * GET: find user by id
 * PUT: update user by id
 * DELETE: deletes user by id
 */

function getThings(req, res) {
  db.any('SELECT * FROM todo')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL info'
        });
    })
    .catch(function (err) {
      return next(err);
    });
};


app.listen(3000, function(){
 console.log('listening on port 3000')
});