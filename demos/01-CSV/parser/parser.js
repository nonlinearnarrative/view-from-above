const fs = require('fs');
const parse = require('csv-parse/lib/sync')

const files = [
	'tabula-assassinatos-2014.csv',
	'tabula-assassinatos-2015.csv',
	'tabula-assassinatos-2016.csv',
	'tabula-assassinatos-2017.csv',
];

const data = [];

files.forEach((file) => {
	const fileContents = fs.readFileSync('csv/' + file, 'utf8');

	const rows = parse(fileContents);

	rows.forEach((row, num) => {

		console.log(row[2]);
		const municipality = row[0];
		const conflict = row[1];
		const date = row[2];
		const victim = row[3];
		const age = parseInt(row[5].replace(' ', ''));
		const category = row[6];


		data.push({
			municipality: municipality,
			conflict: conflict,
			date: date,
			victim: victim,
			age: age,
			category: category,
		});
	});	
});

const json = JSON.stringify(data);
fs.writeFileSync('data.json', json, 'utf8');
