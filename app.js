var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
 
var app = express();
 
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
 
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
 
mongoose.connect('mongodb://localhost/Company');
 
var Schema = new mongoose.Schema({
	_id    : String,
	name: String,
	age   : Number
});
 
var user = mongoose.model('emp', Schema);
 
app.get('/user/:id/edit', function(req, res){
	res.render('edit-form', {user: req.userId});
});
 
app.put('/user/:id', function(req, res){
	user.findByIdAndUpdate({_id: req.params.id},
	                   {
			   	  name: req.body.name,
				  age   : req.body.age
			   }, function(err, docs){
			 	if(err) res.json(err);
				else
				{ 
				   console.log(docs);
				   res.redirect('/user/'+req.params.id);
				 }
			 });
});
 
app.param('id', function(req, res, next, id){
	user.findById(id, function(err, docs){
			if(err) res.json(err);
			else
			{
				req.userId = docs;
				next();
			}
		});	
});
 
 
app.get('/user/:id', function(req, res){
	res.render('show', {user: req.userId});
});
 
app.get('/view', function(req, res){
	user.find({}, function(err, docs){
		if(err) res.json(err);
		else    res.render('index', {users: docs})
	});
});
 
app.post('/new', function(req, res){
	new user({
		_id    : req.body.email,
		name: req.body.name,
		age   : req.body.age				
	}).save(function(err, doc){
		if(err) res.json(err);
		else    res.redirect('/view');
	});
});
 
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});