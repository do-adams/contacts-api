'use strict';

const createError = require('http-errors'),
	express = require('express'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/contacts');

const contactSchema = new mongoose.Schema({
	primarycontactnumber: {type: String, index: {unique: true}},
	firstname: String,
	lastname: String,
	title: String,
	company: String,
	jobtitle: String,	
	othercontactnumbers: [String],
	primaryemailaddress: String,
	emailaddresses: [String],
	groups: [String]
});

const Contact = mongoose.model('Contact', contactSchema),
	dataservice = require('./modules/contactdataservice');

app.get('/contacts/:number', function(request, response) {
	console.log(request.url + ' : querying for ' + request.params.number);
	dataservice.findByNumber(Contact, request.params.number, response);	
});


app.post('/contacts', function(request, response) {
	dataservice.update(Contact, request.body, response);
});

app.put('/contacts', function(request, response) {
	dataservice.create(Contact, request.body, response);
});


app.delete('/contacts/:primarycontactnumber', function(request, response) {
		console.log(dataservice.remove(Contact, request.params.primarycontactnumber, response));
});

app.get('/contacts', function(request, response) {
	dataservice.list(Contact, response);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
