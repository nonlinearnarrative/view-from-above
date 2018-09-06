const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	const data = JSON.parse(fs.readFileSync('murders.json', 'utf8'));
	res.json({ murders: data });
});

app.listen(3000, () => console.log('Example app listening on port 3000!')); 
