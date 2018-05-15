const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const url = require('url');
const os = require('os');
const fs = require('fs');
const amortizer = require('./amortizer');
const api = require('./api');
const media = require('./media')

const app = express();

app.set('port', process.env.PORT || 3000);

let server = app.listen(app.get('port'), function () {
	console.log('Express noding at ' + server.address().port);
});

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/media', media);

app.use('/api', api);

app.set('env', 'production')


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
