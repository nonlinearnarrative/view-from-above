const fs = require('fs');
const parse = require('csv-parse/lib/sync')

const files = [
	'tabula-assassinatos-1997.csv',
	'tabula-assassinatos-1998.csv',
	'tabula-assassinatos-1999.csv',
	'tabula-assassinatos-2000.csv',
	'tabula-assassinatos-2001.csv',
	'tabula-assassinatos-2002.csv',
	'tabula-assassinatos-2003.csv',
	'tabula-assassinatos-2004.csv',
	'tabula-assassinatos-2005.csv',
	'tabula-assassinatos-2006.csv',
	'tabula-assassinatos-2007.csv',
	'tabula-assassinatos-2008.csv',
	'tabula-assassinatos-2009.csv',
	'tabula-assassinatos-2010.csv',
	'tabula-assassinatos-2011.csv',
	'tabula-assassinatos-2012.csv',
	'tabula-assassinatos-2013.csv',
	'tabula-assassinatos-2014.csv',
	'tabula-assassinatos-2015.csv',
	'tabula-assassinatos-2016.csv',
	'tabula-assassinatos-2017.csv',
];

const data = [];


const keyMapping = {
	'Data': 'Data',
	'Nome da Vítima': 'Nome da Vítima',
	'Prof. / Categ.': 'Categoria',
	'Município': 'Município',
	'Indícios de autoria': 'Indícios de Autoria',
	'Indícios de Autoria': 'Indícios de Autoria',
	'Indícios de autoria': 'Indícios de Autoria',

	'Idade': 'Idade',
	'Profissão/Categoria': 'Categoria',
	'Indícios de Autoria': 'Indícios de Autoria',
	'Profissão/Categoria': 'Profissão/Categoria',
	'Indícios de Autoria': 'Indícios de Autoria',
	'Estado': 'Estado',
	'Nome do Conflito': 'Nome do Conflito',
	'Municípios': 'Município',
	'Categoria': 'Categoria',
	'Vítima': 'Vítima',
}

let header = false;

files.forEach((file) => {
	const fileContents = fs.readFileSync('csv/' + file, 'utf8');

	const rows = parse(fileContents);


	rows.forEach((row, num) => {


		if (num === 0) {
			header = row;			
		} else {
			let entry = {};

			for (let i=0; i<header.length; i++) {
				const key = keyMapping[header[i]];

				if (key !== undefined) {
					let value = row[i].trim();

					if (key === 'Idade') {
						let v = parseInt(value.replace(' ', ''));
						if (!isNaN(v)) {
							value = v;
						}
					}
					entry[key] = value;
				}
			}
			data.push(entry);
		}

		
	});	
});

const json = JSON.stringify(data);
fs.writeFileSync('data.json', json, 'utf8');
