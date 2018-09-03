
const createError = require('http-errors'),
express = require('express'),
mongoose = require('mongoose'),
Grid = require('gridfs-stream'),
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
var mongodb = mongoose.connection;
var gfs = Grid(mongodb.db, mongoose.mongo);

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
_v1 = require('./modules/contactdataservice_v1');

app.get('/v1/contacts/:number', function(request, response) {
	console.log(request.url + ' : querying for ' + request.params.number);
	_v1.findByNumber(Contact, request.params.number, response);
});

app.post('/v1/contacts/', function(request, response) {
	_v1.update(Contact, request.body, response);
});

app.put('/v1/contacts/', function(request, response) {
	_v1.create(Contact, request.body, response);
});

app.delete('/v1/contacts/:primarycontactnumber', function(request, response) {
	_v1.remove(Contact, request.params.primarycontactnumber,response);
});

var _v2 = require('./modules/contactdataservice_v2');

app.get('/contacts', function(request, response) {
	var get_params = request.query;
	if (Object.keys(get_params).length == 0)
	{
		_v2.list(Contact, response);
	}
	else
	{
		var key = Object.keys(get_params)[0];
		var value = get_params[key];
		JSON.stringify(_v2.query_by_arg(Contact, key, value,response));
	}
});

app.get('/v2/contacts/:primarycontactnumber/image', function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.getImage(gfs, request.params.primarycontactnumber, response);
});

app.get('/contacts/:primarycontactnumber/image',function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.getImage(gfs, request.params.primarycontactnumber, response);
});

app.post('/v2/contacts/:primarycontactnumber/image', function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.updateImage(gfs, request, response);
});

app.post('/contacts/:primarycontactnumber/image', function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.updateImage(gfs, request, response);
});

app.put('/v2/contacts/:primarycontactnumber/image', function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.updateImage(gfs, request, response);
});

app.put('/contacts/:primarycontactnumber/image', function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.updateImage(gfs, request, response);
});

app.delete('/v2/contacts/:primarycontactnumber/image', function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.deleteImage(gfs, mongodb.db,request.params.primarycontactnumber, response);
});
	
app.delete('/contacts/:primarycontactnumber/image', function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.deleteImage(gfs, mongodb.db, request.params.primarycontactnumber, response);
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
	