const fs = require('fs');
const express = require('express');
const app = express();
const glob = require('glob');

app.get('/map', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);


	const screenshots = './data/';
	
	const files = [];
	fs.readdirSync(screenshots).forEach(file => {
		files.push(file);
	})
	res.json({ screenshots: files });
});

const data = {};
const documentsDir = '../site/documents'
const years = fs.readdirSync(documentsDir);
years.forEach((year) => {
	data[year] = {};
	const months = fs.readdirSync(documentsDir+'/'+year);
	months.forEach((month) => {
		const monthPath = documentsDir+'/'+year+'/'+month;
		const isDir = fs.lstatSync(monthPath).isDirectory();
		if (isDir) {
			data[year][month] = {};
			const dataTypes = fs.readdirSync(monthPath);
			dataTypes.forEach((type) => {
				data[year][month][type] = [];
				const files = fs.readdirSync(monthPath+'/'+type);
				files.forEach((file) => {
					data[year][month][type].push(file);
				});
			});
			
		} else {
			data[year].articles = month;
		}

	});

	// console.log(months);
});

const json = JSON.stringify(data);
fs.writeFileSync('data.json', json, 'utf8');

