const fs = require('fs');
const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify');

const fileContents = fs.readFileSync('data3.csv', 'utf8');

const allRows = parse(fileContents);

const rows1 = [];

allRows.forEach((row) => {

	const isSubtotal = (row[0].toLowerCase().indexOf('subtotal:') >= 0);
	const isTotal = (row[0].toLowerCase().indexOf('total:') >= 0);
	const isHeader = (row[0].toLowerCase().indexOf('municípios') >= 0);
	

	if (isSubtotal == false && isTotal === false && isHeader === false) {
		row.unshift('-');
		rows1.push(row);		
	}

	
});

const rows = [];
let state = '';
rows1.forEach((row, num) => {
	if (row[0] === '-' && row[1].length > 0 && row[2].length === 0 && row[3].length === 0 && row[4].length === 0 && row[5].length === 0 && row[6].length === 0 && row[7].length === 0 && row[8].length === 0) {
		state = row[1];
	} else {
		row[0] = state;
		rows.push(row);
	}

});


stringify(rows, { quoted: true }, function(err, output) {
	// console.log(output)
	fs.writeFile('result.csv', output, 'utf8', function(err) {
		if (err) {
			console.log('Some error occured - file either not saved or corrupted file saved.');
		} else {
			console.log('It\'s saved!');
		}
	});
});

// console.log(rows);
// const json = JSON.stringify(data);
// fs.writeFileSync('data.json', json, 'utf8');
// 1352