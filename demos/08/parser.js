const fs = require('fs');
const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify');
const slugify = require('slugify')


const files = [
	'tabula-ocupacoes-2008.csv',
	'tabula-ocupacoes-2009.csv',
	'tabula-ocupacoes-2010.csv',
	'tabula-ocupacoes-2011.csv',
	'tabula-ocupacoes-2012.csv',
	'tabula-ocupacoes-2013.csv',
	'tabula-ocupacoes-2014.csv',
	'tabula-ocupacoes-2015.csv',
	'tabula-ocupacoes-2016.csv',
];

rows1 = [];
files.forEach((file) => {
	const fileContents = fs.readFileSync('csv/'+file, 'utf8');
	const csvRows = parse(fileContents);
	csvRows.forEach((row, num) => {
		const isSubtotal = (row[0].toLowerCase().indexOf('subtotal:') >= 0);
		const isTotal = (row[0].toLowerCase().indexOf('total:') >= 0);
		const isHeader = (row[0].toLowerCase().indexOf('municípios') >= 0 || row[0].toLowerCase().indexOf('municipios') >= 0);
		
		if (isSubtotal == false && isTotal === false && isHeader === false) {
			row.unshift('-');
			rows1.push(row);		
		}
	});
});

const rows2 = [];
let state = '';
rows1.forEach((row, num) => {
	if (row[0] === '-' && row[1].length > 0 && row[2].length === 0 && row[3].length === 0 && row[4].length === 0 && row[5].length === 0 && row[6].length === 0) {
		state = row[1];
	} else {
		row[0] = state;
		if (row[1].length > 0) {
			rows2.push(row);	
		}
		
	}

});

const data = {};
rows2.forEach((row) => {
	const municipality = row[1];
	const slug = slugify(municipality).toLowerCase();
	if (data[slug] == undefined) {
		data[slug] = {
			municipality: municipality,
			occupations: [],
		}
	} 
	data[slug].occupations.push(row);
});


// stringify(rows2, { quoted: true }, function(err, output) {
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
