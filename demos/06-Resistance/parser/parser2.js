const fs = require('fs');
const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify');

const fileContents = fs.readFileSync('blockades.csv', 'utf8');
const csvRows = parse(fileContents);

const industries = JSON.parse(fs.readFileSync('states_production.json', 'utf8'));

const data = {};

csvRows.forEach((row, num) => {
	const state = row[0];
	const municipality = row[1];
	const claim_group = row[10];

	const place = row[3];
	const match1 = place.match(/[A-Z]{2}-\d{3}/);
	const match2 = place.match(/[A-Z]{2}\d{3}/);
	const match3 = place.match(/[A-Z]{2}\d{2}/);
	const match4 = place.match(/[A-Z]{2}\s\d{2}/);
	const match5 = place.match(/[A-Z]{2}\s-\s\d{2}/);
	const match6 = place.match(/[A-Z]{2}-\d{2}/);
	const match7 = place.match(/[A-Z]{2}\s-\s\d{3}/);
	let road = null;
	if (match1) {
		road = match1[0];
	} else if (match2) {
		road = match2[0];
	} else if (match3) {
		road = match3[0];
	} else if (match4) {
		road = match4[0];
	} else if (match5) {
		road = match5[0];
	} else if (match6) {
		road = match6[0];
	} else if (match7) {
		road = match7[0];
	} else {
		road = place;
		road = road.replace('Bloqueio de ', '');
		road = road.replace('Bloq. da ', '');
		road = road.replace('Bloq. ', '');
		road = road.replace('Bloqueio da ', '');
		road = road.replace('', '');
		road = road.replace('', '');
		road = road.replace('', '');
		road = road.replace('', '');
		road = road.replace('', '');
		road = road.replace('', '');
		road = road.replace('', '');
		road = road.replace('', '');
		road = road.replace('', '');
		road = road.replace('', '');

		
	}
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
			type_of_claim_group: row[10],
			type_of_violence: row[11],
			type_of_violence_en: row[12],
			road: road,
		};

		if (data[state] === undefined) {
			data[state] = {
				num_entries: 0,
				claim_groups_list: [],
				industries: industries[state],
				municipalities: {}
			}
		}

		if (data[state].municipalities[municipality] === undefined) {
			data[state].municipalities[municipality] = {
				num_entries: 0,
				claim_groups_list: [],
				claim_groups: {},
			}
		}

		if (data[state].municipalities[municipality].claim_groups[claim_group] === undefined) {
			data[state].municipalities[municipality].claim_groups[claim_group] = {
				num_entries: 0,
				claim_groups_list: [],
				entries: [],
			};
		}

		data[state].municipalities[municipality].claim_groups[claim_group].entries.push(entry);
	}

});

for (let state in data) {

	for (let municipality in data[state].municipalities) {
		for (let claim_group in data[state].municipalities[municipality].claim_groups) {

			if (data[state].claim_groups_list.indexOf(claim_group) < 0) {
				data[state].claim_groups_list.push(claim_group);	
			}

			if (data[state].municipalities[municipality].claim_groups_list.indexOf(claim_group) < 0) {
				data[state].municipalities[municipality].claim_groups_list.push(claim_group);	
			}
			
			if (data[state].municipalities[municipality].claim_groups[claim_group].claim_groups_list.indexOf(claim_group) < 0) {
				data[state].municipalities[municipality].claim_groups[claim_group].claim_groups_list.push(claim_group);	
			}

			data[state].num_entries += data[state].municipalities[municipality].claim_groups[claim_group].entries.length;	
			data[state].municipalities[municipality].num_entries += data[state].municipalities[municipality].claim_groups[claim_group].entries.length;
			data[state].municipalities[municipality].claim_groups[claim_group].num_entries += data[state].municipalities[municipality].claim_groups[claim_group].entries.length;
		}
	}
}

const json = JSON.stringify(data);
fs.writeFileSync('blockades.json', json, 'utf8');
