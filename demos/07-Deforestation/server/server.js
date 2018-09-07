const fs = require('fs');
const express = require('express');
const app = express();
const glob = require('glob');

// app.get('/map', (req, res) => {
// 	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// 	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
// 	res.setHeader('Access-Control-Allow-Credentials', true);


// 	const screenshots = './data/';
	
// 	const files = [];
// 	fs.readdirSync(screenshots).forEach(file => {
// 		files.push(file);
// 	})
// 	res.json({ screenshots: files });
// });


// app.get('/data', (req, res) => {
// 	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// 	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
// 	res.setHeader('Access-Control-Allow-Credentials', true);


// 	const screenshots = './documents/';
	
// 	const files = [];
	
// 	fs.readdirSync(screenshots).forEach(folder => {
// 		files.push(file);
		

// 	})
// 	res.json({ screenshots: files });
// });



// app.listen(3000, () => console.log('Example app listening on port 3000!')); 


const files = fs.readdirSync('.');
console.log(files);