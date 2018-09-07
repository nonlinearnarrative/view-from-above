let occupations;
let currentState;
let waterFeatures;

let currentOrganisation;

fetch('http://localhost:3000/', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then(function(data) {
	console.log(data);
	occupations = data.states;

	let organisations = [];


	for(let state in data.states){
		
		data.states[state].occupations.forEach(function(occ){
			let organisation = occ.organization;
			if(
				organisations.indexOf(organisation) === -1 && (
					organisation.indexOf('/') === -1 && 
					organisation.indexOf('*') === -1 && 
					organisation.indexOf(' ') === -1 &&
					organisation.length !== 0
				)
			){
				organisations.push(organisation);
			}

		});

	}

	organisations.forEach(function(organisation){
		let option = document.createElement('option');
		option.value = organisation; 
		option.innerText = organisation; 
		document.querySelector('select').appendChild(option);
	});

	document.querySelector('select').addEventListener('change', function(){
		currentOrganisation = this.value;
		console.log(currentOrganisation);
	});
});

fetch('http://localhost:3000/water', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then(function(data) {
	waterFeatures = data;
	doMap();


	// for(let state in data.states){
		
	// 	data.states[state].occupations.forEach(function(occ){
	// 		let organisation = occ.organization;

	// 		console.log(organisation);
	// 	});
	// }
});



function doMap(){

	mapboxgl.accessToken = 'pk.eyJ1IjoiYW5lY2RvdGUxMDEiLCJhIjoiY2oxMGhjbmpsMDAyZzJ3a2V0ZTBsNThoMiJ9.1Ce55CnAaojzkqgfX70fAw';

	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/anecdote101/cjlqeg5fa90892rqnyydsovih',
		center: [-47.728, -14.455],
		zoom: 3.8
	});
	var hoveredStateId =  null;
	
	
	map.on('load', function () {

		
		// waterFeatures.features.forEach(function(marker) {

		// 	var el = document.createElement('div');
		// 	el.className = 'marker';

		// 	new mapboxgl.Marker(el)
		// 	.setLngLat(marker.geometry.coordinates)
		// 	.addTo(map);
		// });

	

		map.addSource("states", {
			"type": "geojson",
			"data": "brazil-states.geojson"
		});



		
		map.addLayer({
			"id": "state-fills",
			"type": "fill",
			"source": "states",
			"layout": {},
			"paint": {
				"fill-color": "#dddddd",
				"fill-opacity": ["case",
					["boolean", ["feature-state", "hover"], false],
					1,
					0
				]
			}
		});

		map.addLayer({
			"id": "state-borders",
			"type": "line",
			"source": "states",
			"layout": {},
			"paint": {
				"line-color": "#000000",
				"line-width": 1
			}
		});


		map.on("mousemove", "state-fills", function(e) {	 
			if (e.features.length > 0) {
				if (hoveredStateId) {
					map.setFeatureState({source: 'states', id: hoveredStateId}, { hover: false});
				}
				
				hoveredStateId = e.features[0].properties.id;

				let stateName = e.features[0].properties.name;
				console.log(stateName);
				if(stateName !== currentState){
					let stateData = _.findWhere(occupations, {state: stateName});
					currentState = stateName;
					if(stateData !== undefined){
						showData(stateData, e.point);	
					}
					
				}
				map.setFeatureState({source: 'states', id: hoveredStateId}, { hover: true});
			}
		});

		map.on("mouseleave", "state-fills", function() {
			if (hoveredStateId) {
				map.setFeatureState({source: 'states', id: hoveredStateId}, { hover: false});
			}
			hoveredStateId =  null;
			document.querySelector('#info').style.display = 'none';
		});
	});
}

function showData(stateData, point){

	let occupations = stateData.occupations;

	document.querySelector('#info').innerHTML = '';
	document.querySelector('#info').style.top = point.y + 'px';
	document.querySelector('#info').style.left = point.x + 'px';
	
	if(currentOrganisation !== undefined){
		numApplicable = _.filter(occupations, function(item){

			if(item.organization.indexOf(currentOrganisation) !== 0){
				return true;
			} else {
				return false;
			}
		});		
	} else {
		numApplicable = occupations;
	}

	console.log(numApplicable.length);

	if(numApplicable.length > 0){
		document.querySelector('#info').style.display = 'block';
		numApplicable.forEach(function(occupation){
		
			
			let row = document.createElement('div');
			row.classList.add('row');
			let propertName = occupation.occupied_property_name;
			let propertyNameEl = document.createElement('div');
			propertyNameEl.innerText = propertName;
			
			let organisationEl = document.createElement('div');
			organisationEl.innerText = occupation.organization;

			row.appendChild(propertyNameEl);
			row.appendChild(organisationEl);

			document.querySelector('#info').appendChild(row);


			
		});
	}

	

}

