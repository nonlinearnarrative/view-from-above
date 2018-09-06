const fs = require('fs');
const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify');


const files = [
	'tabula-Acts of Resistence_2005.csv',
	'tabula-Acts of Resistence_2006.csv',
	'tabula-Acts of Resistence_2007.csv',
	'tabula-Acts of Resistence_2008.csv',
	'tabula-Acts of Resistence_2009.csv',
	'tabula-Acts of Resistence_2010.csv',
	'tabula-Acts of Resistence_2011.csv',
	'tabula-Acts of Resistence_2012.csv',
	'tabula-Acts of Resistence_2013.csv',
	'tabula-demonstrations_2004.csv',
	'tabula-demonstrations_2009.csv',
	'tabula-demonstrations_2010.csv',
	'tabula-demonstrations_2011.csv',
	'tabula-demonstrations_2012.csv',
	'tabula-demonstrations_2013.csv',
	'tabula-demonstrations_2015.csv',
	'tabula-demonstrations_2016.csv',
	'tabula-demonstrations_2017.csv',
];

rows1 = [];
files.forEach((file) => {
	const fileContents = fs.readFileSync('csv/'+file, 'utf8');
	const csvRows = parse(fileContents);
	csvRows.forEach((row, num) => {
		const isSubtotal = (row[0].toLowerCase().indexOf('subtotal:') >= 0);
		const isTotal = (row[0].toLowerCase().indexOf('total:') >= 0);
		const isHeader = (row[0].toLowerCase().indexOf('municípios') >= 0);
		

		if (isSubtotal == false && isTotal === false && isHeader === false) {

			const dmy = row[3].split('/');
			const year = file.split('.')[0].split('_').pop();
			if (dmy.length == 3) {
				dmy[2] = year;				
			}
			
			row[3] = dmy.join('/');
			row.unshift('-');
			rows1.push(row);					
		}
	});
});

const rows2 = [];
let state = '';
rows1.forEach((row, num) => {
	if (row[0] === '-' && row[1].length > 0 && row[2].length === 0 && row[3].length === 0 && row[4].length === 0 && row[5].length === 0 && row[6].length === 0 && row[7].length === 0 && row[8].length === 0 && row[9].length === 0) {
		state = row[1];
	} else {
		row[0] = state;
		rows2.push(row);
	}

});

const rows3 = [];
rows2.forEach((row, num) => {
	const place = row[3];
	isBloc = place.toLowerCase().indexOf('bloq') >= 0;
	if (isBloc) {

		const places = place.split('/');
		row[3] = places[0];
		let place2 = (places.length > 1) ? places[1] : '';
		row.splice(4, 0, place2);
		rows3.push(row);
	}
	
	
});

const data = {}
const stateIndustries = JSON.parse(fs.readFileSync('states_production.json', 'utf8'));

rows3.forEach((row, num) => {

	const municipality = row[1];
	const state = row[0];
	const industries = stateIndustries[state];

	console.log(industries);

	const entry = {
		state: state,
		municipality: municipality,
		feature: row[2],
		action_name: row[3],
		date: row[4],
		num_participant: row[5],
		kind_of_work: row[6],
		type_of_claim: row[7],
		organization: row[8],
		type_of_violence: row[9],
	};

	if (data[municipality] === undefined) {
		data[municipality] = {
			municipality: municipality,
			// industries: industries,
			actions: [],
		}
	}

	data[municipality].actions.push(entry);

	// console.log(entry);
});


// stringify(rows3, { quoted: true }, function(err, output) {
// 	// console.log(output)
// 	fs.writeFile('result.csv', output, 'utf8', function(err) {
// 		if (err) {
// 			console.log('Some error occured - file either not saved or corrupted file saved.');
// 		} else {
// 			console.log('It\'s saved!');
// 		}
// 	});
// });

const json = JSON.stringify(data);
fs.writeFileSync('data.json', json, 'utf8');
