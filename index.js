const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const url = require('url');
const amortizer = require('./amortizer')
const api = require('./api')

const app = express();

app.set('port', process.env.PORT || 3000);

let server = app.listen(app.get('port'), function () {
    console.log('Express noding at ' + server.address().port);
});

const forceSSL = function () {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(
                ['https://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
}


app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//serve over https
// app.use(forceSSL())

app.use('/api', api)

//dev error handler
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
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
