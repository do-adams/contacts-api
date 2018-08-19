'use strict';

const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan');

const app = express(),
  contacts = require('./modules/contacts');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/contacts', 
		function(request, response){
			var get_params = request.query;
			
			if (Object.keys(get_params).length === 0)
			{
				response.setHeader('content-type', 'application/json');
				response.end(JSON.stringify(contacts.list()));	
			}
			else
			{
				response.setHeader('content-type', 'application/json');
				response.end(JSON.stringify(contacts.query_by_arg(get_params.arg, get_params.value)));
			}
		}
);


app.get('/contacts/:number', function(request, response) {
	response.setHeader('content-type', 'application/json');	
	response.end(JSON.stringify(contacts.query(request.params.number)));
});

app.get('/groups', function(request, response) {
	response.setHeader('content-type', 'application/json');	
	response.end(JSON.stringify(contacts.list_groups()));
});

app.get('/groups/:name', function(request, response) {
	response.setHeader('content-type', 'application/json');	
	response.end(JSON.stringify(contacts.get_members(request.params.name)));
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
