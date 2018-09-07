
let murders;
let geoInfo;
let population;

fetch('all-data.json', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then(function(data) {

	murders = data.murders;
	geoInfo = data.geoInfo;
	population = data.population;
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
				yearElement.classList.add('year-'+year);
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

	plotGraph(years[2016], 2016);

	let colors = {};
	
	document.querySelectorAll('#year-menu .inner div').forEach(function(el){
		el.addEventListener('click', function(e){
			let year = el.innerText;
			if(document.querySelector('#year-menu div.active') !== null){
				document.querySelector('#year-menu div.active').classList.remove('active');
			}
			plotGraph(years[year], year);
			
			
					
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

let maxMurdersInEvent = 0;

function plotGraph(year, yearName){
	document.querySelector('#year-menu .inner div.year-'+yearName).classList.add('active');
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
	//  let stateElement = document.createElement('div');
	//  stateElement.setAttribute('data-state', state.stateName);
	//  stateColumns.appendChild(stateElement);
	//  stateElement.classList.add('state-column');
	//  let header = document.createElement('div');
	//  header.classList.add('header');
	//  header.innerHTML = state.abbr;
	//  stateElement.appendChild(header);
	// });

	let yearHeading = document.createElement('div');
	yearHeading.innerText = yearName;

	document.querySelector('#info .year').innerHTML = '';
	document.querySelector('#info .year').appendChild(yearHeading);
	yearContainter.appendChild(monthLegend);
	yearContainter.appendChild(stateColumns);
	document.querySelector('#murders').appendChild(yearContainter);
	let numEvents = 0;
	let numMurders = 0;

	

	for(let state in year){
		
		let stateColumn = document.querySelector('.year-container.year-'+yearName+' div[data-state="'+state+'"]');

		//let area = 'unknown';
		let area = _.findWhere(geoInfo, {stateName: state }).region;
		// for(let i in stateMap){
		//  if(stateMap[i].state === state){
		//      area = stateMap[i].area;
		//      break;
		//  }
		// }

		stateColumn.classList.add(area);
		for(let i = 0; i < 12; i++){
			let monthContainer = document.createElement('div');
			monthContainer.classList.add('month');
			monthContainer.setAttribute('data-month', i+1);
			stateColumn.appendChild(monthContainer);
		}


		for(let event in year[state]){
			
			let numInEvent = year[state][event].length;
			
			let opacity = mapRange(numInEvent, 1, 11, 0.4, 1);


			let eventContainer = document.createElement('div');
			eventContainer.setAttribute('data-event', event);
			stateColumn.appendChild(eventContainer);
			numEvents++;
			for(let murder in year[state][event]){

				let murderElement = document.createElement('div');
				let month = year[state][event][murder].momentDate.format('M');

				murderElement.classList.add('murder');
				murderElement.setAttribute('data-ref', year[state][event][murder].ref);
				murderElement.addEventListener('mouseenter', showMurder);
				murderElement.addEventListener('mouseleave', hideMurder);
				murderElement.style.opacity = opacity;

				//murderElement.innerText = month;

				let monthContainer = document.querySelector('.year-container.year-'+yearName+' div[data-state="'+state+'"] .month[data-month="'+month+'"]');
				eventContainer.appendChild(murderElement);
				
				numMurders++;
				monthContainer.appendChild(eventContainer);
			}
			eventContainer.classList.add('event-container');

		}
	}
	let totalMurders = document.createElement('div');
	totalMurders.innerText = numMurders + '  Murders | Assassinatos';
	let totalEvents = document.createElement('div');
	totalEvents.innerText = numEvents + ' Conflicts | Conflitos';

	document.querySelector('#info .murders .values').innerHTML = '';
	document.querySelector('#info .murders .values').appendChild(totalMurders);
	document.querySelector('#info .murders .values').appendChild(totalEvents);


	let yearPopulation = population[yearName];

	let populationTotals = {};
	let b = 0;
	for(let region in yearPopulation.regions){
		if(region !== 'Brazil'){
			if(!(region in populationTotals)){
				populationTotals[region] = 0;
			}
			for(let state in yearPopulation.regions[region]){
				populationTotals[region] += yearPopulation.regions[region][state];
				b+= yearPopulation.regions[region][state];
			}
		}
	}

	document.querySelector('#info .graph').innerHTML = '';
	for(let region in populationTotals){
		let percentage = ((populationTotals[region]/b) * 100).toFixed(2);
		let section = document.createElement('div');
		section.classList.add(region);
		section.innerText = percentage+'%';
		section.style.flex = '0 1 '+percentage+'%';
		document.querySelector('#info .graph').appendChild(section);
	}


	let brazilPopulation = yearPopulation.regions['Brazil'];
	document.querySelector('#info .population .brazil .value').innerText = numberWithCommas(brazilPopulation['Brazil']);

	console.log(maxMurdersInEvent);

}

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// function plotYear(year, yearName){
//  console.log(year);
//  let yearContainter = document.createElement('div');
//  yearContainter.classList.add('year-container', 'year-'+yearName);

//  for(let i = 0; i < 365; i++){
//      let day = document.createElement('div');
//      yearContainter.appendChild(day);
//      day.addEventListener('mouseenter', showMurder);
//  }
//  document.querySelector('#murders').appendChild(yearContainter);
	
	

//  year.forEach(function(murder){

//      let day = murder.momentDate.format('DDD');  
//      let murderDay = document.querySelector('.year-container.year-'+yearName+' div:nth-child('+day+')');
//      murderDay.style.backgroundColor = 'red';
//      murderDay.setAttribute('data-murder', murder.ref);
//  });
// }

function hideMurder(e){
	e.target.classList.remove('hovered');
	document.querySelectorAll('.tooltip').forEach(function(el){
		el.parentNode.removeChild(el);
	});
}

function showMurder(e){
	e.target.classList.add('hovered');
	let murder = murders[this.getAttribute('data-ref')];
	let tooltip = document.createElement('div');
	tooltip.classList.add('tooltip');
	e.target.appendChild(tooltip);
	tooltip.innerHTML = '';
	//tooltip.innerText = murder['Nome da Vítima'];
	console.log(murder);
	let dateMunicipality = murder['Data'] + '<br/>' +murder['Municípios'] + '–' + murder['State(UF)'];
	let dm = document.createElement('div');
	dm.innerHTML = dateMunicipality;

	let event = murder['Nome do Conflito'];
	let name = murder['Nome da Vítima'];
	let categoty = murder['Categoria'];

	let info = document.createElement('div');
	info.classList.add('info');
	info.innerHTML = `
		${event}<br/>
		<span>${name}</span><br/>
		${categoty}
	`;



	tooltip.appendChild(dm);
	tooltip.appendChild(info);
}


function mapRange(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}





