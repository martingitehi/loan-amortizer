const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const client = require('mongodb').MongoClient;
const assert = require('assert');
const mongoose = require('mongoose');
const amortizer = require('./amortizer');
const api = require('./api');
const media = require('./media');
const auth = require('./authentication');

mongoose.connect('mongodb://127.0.0.1:27017/buffy').then(() => {
	mongoose.connection.on('open', (err, client) => {
		assert.equal(null, err)
		if (err) {
			return console.log(err.message);
		}
		return console.log('Buffy is Connected.');
	})
})

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'))

let server = app.listen(app.get('port'), () => {
	console.log('API running at '+ server.address().port)
});

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', api);
app.use('/auth', auth);
app.use('/media', media);


//dev error handler
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			message: err.message | 'Server error',
			error: err
		});
	});
}

// production error handler
app.use(function (err, req, res, next) {
	res.json({
		message: err.message | 'Server error',
		error: {}
	});
});

module.exports = app;
