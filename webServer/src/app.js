const express = require('express');
const logger = require('morgan');
// const http = require('http');
const path = require('path');
const boolParser = require('express-query-boolean');
const { PORT } = require('./common/env');
// const indexRouter = require('./routes/index');
const naverStoreMask = require('./routes/naverStoreMask');

// let port = 80;
const app = express();

// https.createServer(options, app).listen(443, () => {
// console.log('https start');
// });

app.set('port', PORT);
app.use(logger('dev'));
app.use(boolParser());
app.use(express.static(path.join(__dirname, 'web')));
// app.use('/', indexRouter);
app.use('/naverStore', naverStoreMask);
app.get('/test', (req, res) => {
	res.send('list of users');
});

app.listen(app.get('port'), () => {
	// var host = server.address().address;
	// var port = server.address().port;
	console.log(`Express server listening on port ${app.get('port')}`);
});
