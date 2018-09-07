const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
	res.json({ states: data });
});

app.get('/parse', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	const data = JSON.parse(fs.readFileSync('water.json', 'utf8'));


	let geofeature = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": []
		},
		"properties": {}
	};
	let features = [];

	data.forEach(function(feature){
		
		let f = JSON.parse(JSON.stringify(geofeature));
		f.properties = feature; 
		f.geometry.coordinates = [
			randomise(parseFloat(feature.lng.replace(',', '.'))), 
			randomise(parseFloat(feature.lat.replace(',', '.')))
		];
		features.push(f);

	});

	res.json(features);
});

function randomise(flo){
	let r = Math.random() / 10;
	let pm = Math.round(Math.random()) * 2 - 1;
	console.log(flo, flo+=(r * pm));
	return flo+=(r * pm);
}



app.get('/water', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	const data = JSON.parse(fs.readFileSync('water.geojson', 'utf8'));
	res.json({ features: data });
});

app.listen(3000, () => console.log('Example app listening on port 3000!')); 
