const fs = require('fs');
const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify');

const fileContents = fs.readFileSync('data_translations.csv', 'utf8');
const csvRows = parse(fileContents);

const data = {};

csvRows.forEach((row, num) => {
	const state = row[0];
	const municipality = row[1];

	if (num > 0) {
		const entry = {
			state: row[0],
			municipality: row[1],
			feature: row[2],
			place_name: row[3],
			place_name_2: row[4],
			date: row[5],
			num_participants: row[6],
			type_of_work: row[7],
			type_of_claim: row[8],
			type_of_claim_en: row[9],
			type_of_violence: row[10],
			type_of_violence_en: row[11],
		};

		

		if (data[municipality] === undefined) {
			data[municipality] = {
				municipality: municipality,
				actions: [],
			}
		}

		data[municipality].actions.push(entry);
	}

});

const json = JSON.stringify(data);
fs.writeFileSync('data.json', json, 'utf8');
