const express = require('express');
const router = express.Router();
const url = require('url');
const os = require('os');
const fs = require('fs');
const id = require('crypto');
const app = express();
const client = require('mongodb');
const assert = require('assert');
const mongoose = require('mongoose');
const _ = require('lodash')
const guard = require('./guard');
const uuid = require('uuid');
const zlib = require('zlib')

app.set('data', __dirname + '/public/images/');

router.get('/data', guard, (req, res) => {
	let query = url.parse(req.originalUrl, true).query;
	if (query.db !== undefined && query.db !== null) {
		client.connect('mongodb://127.0.0.1:27017', (err, client) => {
			assert.equal(null, err)
			client.db('buffy')
				.collection(query.db)
				.find()
				.limit(Number.parseInt(query.limit) || 0)
				.toArray((err, docs) => {
					if (err) return res.json({ success: false, message: err.message })
					else {
						res.json({ success: true, records: docs.length, docs: docs })
					}
				})
		})
	}
})

router.get('/files', (req, res) => {
	let query = url.parse(req.url, true).query;
	let fileName = app.get('data');
	let file_data = [];
	let files = fs.readdirSync(fileName);
	_.each(files, (file) => {
		let ext = file.substr(file.lastIndexOf('.') + 1, file.length).toLocaleLowerCase();
		if (file.includes('.')) {
			let f_size = fs.statSync(fileName + file).size;
			let searchRecord = {
				id: uuid.v4(),
				long_name: String(fileName).trim().replace('\\', '//') + file,
				short_name: file,
				size: f_size.toFixed(2) / 1024 < 1 ? f_size.toFixed(2) + 'B'
					: f_size.toFixed(2) / 1024 / 1024 < 1 ? (f_size / 1024).toFixed(2) + 'KB'
						: (f_size / 1024 / 1024).toFixed(2) + 'MB',
				type: ext
			}
			file_data.push(searchRecord)
		}
	})
	res.json({ success: true, records: file_data.length, files: file_data });
})

router.get('/clear-analysis', (req, res, next) => {
	client.connect('mongodb://127.0.0.1:27017', (err, client) => {
		assert.equal(null, err);
		client.db('buffy')
			.collection('analysis')
			.deleteMany({}, (err) => {
				if (err) return res.json(err.message)
				else {
					return res.json({
						success: true,
						message: 'All documents deleted successfully.'
					})
				}
			})
	})
})

router.get('/files/:id', (req, res) => {
	let uri = decodeURI(req.url);
	let filePath = app.get('data') + req.params.id;
	const stat = fs.statSync(filePath)
	const fileSize = stat.size
	const range = req.headers.range

	if (req.params.id !== null && req.params.id !== undefined) {
		if (range) {
			const parts = range.replace(/bytes=/, "").split("-")
			const start = parseInt(parts[0], 10)
			const end = parts[1]
				? parseInt(parts[1], 10)
				: fileSize - 1
			const chunksize = (end - start) + 1
			const file = fs.createReadStream(filePath, { start, end })
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize
			}
			res.writeHead(206, head);
			file.pipe(res);
		}
		else {
			const head = {
				'Content-Length': fileSize
			}
			res.writeHead(200, head)
			fs.createReadStream(filePath).pipe(res)
		}
	}
	else {
		return res.json({ message: 'Please specify a media type to view.' })
	}
});

router.get('/compress', (req, res) => {
	const file = app.get('data') + 'desk dream.png';

	const { Transform } = require('stream');

	const reportProgress = new Transform({
		transform(chunk, encoding, callback) {
			process.stdout.write('*');
			callback(null, chunk);
		}
	});

	fs.createReadStream(file)
		.pipe(zlib.createGzip())
		.pipe(id.createCipher('aes192', 'a_secret'))
		.pipe(reportProgress)
		.pipe(fs.createWriteStream(file + '.zz'))
		.on('finish', () => console.log('Compression Done'));
})

module.exports = router;