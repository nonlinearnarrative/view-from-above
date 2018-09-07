const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	const data = JSON.parse(fs.readFileSync('murders.json', 'utf8'));
	const population = JSON.parse(fs.readFileSync('population.json', 'utf8'));
	const geoInfo = JSON.parse(fs.readFileSync('geo-info.json', 'utf8'));
	res.json({ murders: data, population: population, geoInfo: geoInfo });
});

app.get('/parse', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	const data = JSON.parse(fs.readFileSync('population.json', 'utf8'));


	const years = {};

	for(let i = 1996; i <= 2017; i++){
		years[i] = {
			regions: {}
		};
	}


	data.forEach(function(state){
		console.log(state);
		for(let i in years){
			if(!(state.region in years[i].regions)){
				years[i].regions[state.region] = {};				
			}
			years[i].regions[state.region][state.abbr] = state[i];
		}
		
	});
	res.json(years);

});

app.listen(3000, () => console.log('Example app listening on port 3000!')); 
