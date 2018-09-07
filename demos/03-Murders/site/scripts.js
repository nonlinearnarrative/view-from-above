
let murders;
fetch('http://localhost:3000/', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then(function(data) {
	console.log(data);
	murders = data.murders;
	appendSVG();
	let years = {};
	

	data.murders.forEach(function(murder, i){
		let date = murder.Data;
		let d = moment(date, 'DD/MM/YYYY');
		

		if(d.isValid()){
			murder.momentDate = d;
			murder.ref = i;
			let year = murder.Year;
			let state = murder['State(UF)'];
			let event = murder['Nome do Conflito'];
			let municipality = murder['Municípios'];
			if (!(year in years)){
				years[year] = {};
				let yearElement = document.createElement('div');
				yearElement.innerText = year;
				document.querySelector('#year-menu .inner').appendChild(yearElement);
			}
			
			if(!(state in years[year])){
				years[year][state] = {};
			}
            
			if(_.findWhere(states, {stateName: state}) === undefined && state.length !== 2){
                let fullState = _.findWhere(geoInfo, {stateName: state });
               
				states.push(fullState);
			}

			if(year <= 2001 ){
				let stateDate = state+'-'+date;
				let stateMunicipality = municipality+'-'+date;
				if(!(stateMunicipality in years[year][state])){
					years[year][state][stateMunicipality] = [];
				}
				years[year][state][stateMunicipality].push(murder);
			} else {
				if(!(event in years[year][state])){
					years[year][state][event] = [];
				}
				years[year][state][event].push(murder);

			}
		}
	
	});

	plotGraph(years[1997], 1997);

	let colors = {};
	
	document.querySelectorAll('#year-menu div').forEach(function(el){
		el.addEventListener('click', function(e){
			let year = el.innerText;
			plotGraph(years[year], year);
			if(document.querySelector('#year-menu div.active') !== null){
				document.querySelector('#year-menu div.active').classList.remove('active');
			}
			
			el.classList.add('active');			
		});
	});

}).catch((err) => {
	console.error(err)
});

let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
let states = [];

function appendSVG(){
	xhr = new XMLHttpRequest();
	xhr.open('GET','brazil.svg',false);
	xhr.overrideMimeType('image/svg+xml');
	xhr.send('');
	document.getElementById('svgContainer').appendChild(xhr.responseXML.documentElement);

	document.querySelectorAll('path, polygon').forEach(function(path){
		path.addEventListener('mouseenter', function(e){
			let state = path.id;
			let region = path.parentNode.parentNode.id;
			filterState = state;

			let g = _.findWhere(geoInfo, {abbr: state});
			let applicableRows = document.querySelector('div[data-state="'+g.stateName+'"]');

			document.querySelectorAll('.state-column').forEach(function(el){
				el.classList.add('off');
			});
			applicableRows.classList.remove('off');

			path.classList.add('active');

		});
		path.addEventListener('mouseleave', function(e){
			path.classList.remove('active');
			document.querySelectorAll('.state-column').forEach(function(el){
				el.classList.remove('off');
			});
		});
	});
}

let filterState;

function plotGraph(year, yearName){

	document.querySelector('#visualisation #murders').innerHTML = '';
	let yearContainter = document.createElement('div');

	let monthLegend = document.createElement('div');
	monthLegend.classList.add('month-legend');

	for(let i = 0; i < 12; i++){
		let monthContainer = document.createElement('div');
		monthContainer.classList.add('month');
		monthContainer.setAttribute('data-month', i+1);
		monthContainer.innerText = months[i];
		monthLegend.appendChild(monthContainer);
	}

	let stateColumns = document.createElement('div');
	stateColumns.classList.add('state-columns');

	yearContainter.classList.add('year-container', 'year-'+yearName);
	
    geoInfo.forEach(function(state, i){

        let stateElement = document.createElement('div');
        stateElement.setAttribute('data-state', state.stateName);
        stateElement.setAttribute('data-region', state.region);
        stateColumns.appendChild(stateElement);
        stateElement.classList.add('state-column');
        let header = document.createElement('div');
        header.classList.add('header');
        header.innerHTML = state.abbr;
        stateElement.appendChild(header);

    });

	// states.forEach(function(state){
 //        console.log(state);
	// 	let stateElement = document.createElement('div');
	// 	stateElement.setAttribute('data-state', state.stateName);
	// 	stateColumns.appendChild(stateElement);
	// 	stateElement.classList.add('state-column');
	// 	let header = document.createElement('div');
	// 	header.classList.add('header');
	// 	header.innerHTML = state.abbr;
	// 	stateElement.appendChild(header);
	// });

	// let yearHeading = document.createElement('h1');
	// yearHeading.innerText = yearName;

	yearContainter.appendChild(monthLegend);
	yearContainter.appendChild(stateColumns);
	document.querySelector('#murders').appendChild(yearContainter);

	for(let state in year){
		
		let stateColumn = document.querySelector('.year-container.year-'+yearName+' div[data-state="'+state+'"]');

		//let area = 'unknown';
        let area = _.findWhere(geoInfo, {stateName: state }).region;
		// for(let i in stateMap){
		// 	if(stateMap[i].state === state){
		// 		area = stateMap[i].area;
		// 		break;
		// 	}
		// }

		stateColumn.classList.add(area);
		for(let i = 0; i < 12; i++){
			let monthContainer = document.createElement('div');
			monthContainer.classList.add('month');
			monthContainer.setAttribute('data-month', i+1);
			stateColumn.appendChild(monthContainer);
		}


		for(let event in year[state]){
			

			let eventContainer = document.createElement('div');
			eventContainer.setAttribute('data-event', event);
			stateColumn.appendChild(eventContainer);
			for(let murder in year[state][event]){

				let murderElement = document.createElement('div');
				let month = year[state][event][murder].momentDate.format('M');

				murderElement.classList.add('murder');
				murderElement.setAttribute('data-ref', year[state][event][murder].ref);
				murderElement.addEventListener('mouseenter', showMurder);

				let monthContainer = document.querySelector('.year-container.year-'+yearName+' div[data-state="'+state+'"] .month[data-month="'+month+'"]');
				eventContainer.appendChild(murderElement);
                
                
                monthContainer.appendChild(eventContainer);
			}
			eventContainer.classList.add('event-container');

		}
	}
}

// function plotYear(year, yearName){
// 	console.log(year);
// 	let yearContainter = document.createElement('div');
// 	yearContainter.classList.add('year-container', 'year-'+yearName);

// 	for(let i = 0; i < 365; i++){
// 		let day = document.createElement('div');
// 		yearContainter.appendChild(day);
// 		day.addEventListener('mouseenter', showMurder);
// 	}
// 	document.querySelector('#murders').appendChild(yearContainter);
	
	

// 	year.forEach(function(murder){

// 		let day = murder.momentDate.format('DDD');	
// 		let murderDay = document.querySelector('.year-container.year-'+yearName+' div:nth-child('+day+')');
// 		murderDay.style.backgroundColor = 'red';
// 		murderDay.setAttribute('data-murder', murder.ref);
// 	});
// }

function showMurder(){
	let murder = murders[this.getAttribute('data-ref')];
	console.log(murder);


}

let geoInfo = [
  {
    "1996": 1229306,
    "2000": 1380952,
    "2010": 1562409,
    "abbr": "RO",
    "stateName": "Rondônia",
    "region": "N"
  },
  {
    "1996": 483593,
    "2000": 557882,
    "2010": 733559,
    "abbr": "AC",
    "stateName": "Acre",
    "region": "N"
  },
  {
    "1996": 2389279,
    "2000": 2817252,
    "2010": 3483985,
    "abbr": "AM",
    "stateName": "Amazonas",
    "region": "N"
  },
  {
    "1996": 247131,
    "2000": 324397,
    "2010": 450479,
    "abbr": "RR",
    "stateName": "Roraima",
    "region": "N"
  },
  {
    "1996": 5510849,
    "2000": 6195965,
    "2010": 7581051,
    "abbr": "PA",
    "stateName": "Pará",
    "region": "N"
  },
  {
    "1996": 379459,
    "2000": 477032,
    "2010": 669526,
    "abbr": "AP",
    "stateName": "Amapá",
    "region": "N"
  },
  {
    "1996": 1048642,
    "2000": 1157690,
    "2010": 1383445,
    "abbr": "TO",
    "stateName": "Tocantins",
    "region": "N"
  },
  {
    "1996": 5222183,
    "2000": 5657552,
    "2010": 6574789,
    "abbr": "MA",
    "stateName": "Maranhão",
    "region": "NE"
  },
  {
    "1996": 2673085,
    "2000": 2843428,
    "2010": 3118360,
    "abbr": "PI",
    "stateName": "Piauí",
    "region": "NE"
  },
  {
    "1996": 6809290,
    "2000": 7431597,
    "2010": 8452381,
    "abbr": "CE",
    "stateName": "Ceará",
    "region": "NE"
  },
  {
    "1996": 2558660,
    "2000": 2777509,
    "2010": 3168027,
    "abbr": "RN",
    "stateName": "Rio Grande do Norte",
    "region": "NE"
  },
  {
    "1996": 3305616,
    "2000": 3444794,
    "2010": 3766528,
    "abbr": "PB",
    "stateName": "Paraíba",
    "region": "NE"
  },
  {
    "1996": 7399071,
    "2000": 7929154,
    "2010": 8796448,
    "abbr": "PE",
    "stateName": "Pernambuco",
    "region": "NE"
  },
  {
    "1996": 2633251,
    "2000": 2827856,
    "2010": 3120494,
    "abbr": "AL",
    "stateName": "Alagoas",
    "region": "NE"
  },
  {
    "1996": 1624020,
    "2000": 1784829,
    "2010": 2068017,
    "abbr": "SE",
    "stateName": "Sergipe",
    "region": "NE"
  },
  {
    "1996": 12541675,
    "2000": 13085769,
    "2010": 14016906,
    "abbr": "BA",
    "stateName": "Bahia",
    "region": "NE"
  },
  {
    "1996": 16672613,
    "2000": 17905134,
    "2010": 19597330,
    "abbr": "MG",
    "stateName": "Minas Gerais",
    "region": "SE"
  },
  {
    "1996": 2802707,
    "2000": 3097498,
    "2010": 3514952,
    "abbr": "ES",
    "stateName": "Espírito Santo",
    "region": "SE"
  },
  {
    "1996": 13406308,
    "2000": 14392106,
    "2010": 15989929,
    "abbr": "RJ",
    "stateName": "Rio de Janeiro",
    "region": "SE"
  },
  {
    "1996": 34119110,
    "2000": 37035456,
    "2010": 41262199,
    "abbr": "SP",
    "stateName": "São Paulo",
    "region": "SE"
  },
  {
    "1996": 9003804,
    "2000": 9564643,
    "2010": 10444526,
    "abbr": "PR",
    "stateName": "Paraná",
    "region": "S"
  },
  {
    "1996": 4875244,
    "2000": 5357864,
    "2010": 6248436,
    "abbr": "SC",
    "stateName": "Santa Catarina",
    "region": "S"
  },
  {
    "1996": 9634688,
    "2000": 10187842,
    "2010": 10693929,
    "abbr": "RS",
    "stateName": "Rio Grande do Sul",
    "region": "S"
  },
  {
    "1996": 1927834,
    "2000": 2078070,
    "2010": 2449024,
    "abbr": "MS",
    "stateName": "Mato Grosso do Sul",
    "region": "CW"
  },
  {
    "1996": 2235832,
    "2000": 2505245,
    "2010": 3035122,
    "abbr": "MT",
    "stateName": "Mato Grosso",
    "region": "CW"
  },
  {
    "1996": 4514967,
    "2000": 5004197,
    "2010": 6003788,
    "abbr": "GO",
    "stateName": "Goiás",
    "region": "CW"
  },
  {
    "1996": 1821946,
    "2000": 2051146,
    "2010": 2570160,
    "abbr": "DF",
    "stateName": "Distrito Federal",
    "region": "CW"
  }
];