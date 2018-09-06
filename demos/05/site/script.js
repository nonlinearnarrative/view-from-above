let occupations;
let currentState;
let waterFeatures;
fetch('http://localhost:3000/', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then(function(data) {
	console.log(data);
	occupations = data.states;

	let organisations = [];


	// for(let state in data.states){
		
	// 	data.states[state].occupations.forEach(function(occ){
	// 		let organisation = occ.organization;

	// 		console.log(organisation);
	// 	});
	// }
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
	console.log('water', waterFeatures.states);
	map.on('load', function () {

		

	    map.addLayer({
	        "id": "points",
	        "type": "symbol",
	        "source": {
	            "type": "geojson",
	            "data": {
	                "type": "FeatureCollection",
	                "features": waterFeatures.states
	            }
	        },
	        "layout": {
	            "icon-image": "{icon}-15",
	            "text-field": "{title}",
	            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
	            "text-offset": [0, 0.6],
	            "text-anchor": "top"
	        }
	    });

	    map.addSource("states", {
	        "type": "geojson",
	        "data": "brazil-states.geojson"
	    });



	    // The feature-state dependent fill-opacity expression will render the hover effect
	    // when a feature's hover state is set to true.
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

	    // When the user moves their mouse over the state-fill layer, we'll update the
	    // feature state for the feature under the mouse.

	    map.on("mousemove", "state-fills", function(e) {	 
	        if (e.features.length > 0) {
	            if (hoveredStateId) {
	                map.setFeatureState({source: 'states', id: hoveredStateId}, { hover: false});
	            }
	            
	            //document.querySelector('#info').innerText = e.features[0].properties.name;
	            hoveredStateId = e.features[0].properties.id;
	            
	            
	            let stateName = e.features[0].properties.name;
	            //console.log(stateName);
	            if(stateName !== currentState){
	        		let stateData = _.findWhere(occupations, {state: stateName});
	            	currentState = stateName;
	            	showData(stateData, e.point);
	            }
	            map.setFeatureState({source: 'states', id: hoveredStateId}, { hover: true});
	        }
	    });

	    map.on("mouseleave", "state-fills", function() {
	        if (hoveredStateId) {
	            map.setFeatureState({source: 'states', id: hoveredStateId}, { hover: false});
	        }
	        hoveredStateId =  null;
	    });
	});
}

function showData(stateData, point){

	let occupations = stateData.occupations;

	document.querySelector('#info').innerHTML = '';
	document.querySelector('#info').style.top = point.y + 'px';
	document.querySelector('#info').style.left = point.x + 'px';
	occupations.forEach(function(occupation){
		console.log(occupation);
		let propertName = occupation.occupied_property_name;
		let propertyNameEl = document.createElement('div');
		propertyNameEl.innerText = propertName;
		document.querySelector('#info').appendChild(propertyNameEl);
	});

}

