let murders;
fetch('http://localhost:3000/', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then(function(data) {
	console.log(data);


});

document.addEventListener('DOMContentLoaded', function(){

	mapboxgl.accessToken = 'pk.eyJ1IjoiYW5lY2RvdGUxMDEiLCJhIjoiY2oxMGhjbmpsMDAyZzJ3a2V0ZTBsNThoMiJ9.1Ce55CnAaojzkqgfX70fAw';

	var map = new mapboxgl.Map({
	    container: 'map',
	    style: 'mapbox://styles/anecdote101/cjlqeg5fa90892rqnyydsovih',
	    center: [-47.728, -14.455],
	    zoom: 3.8



	});
	var hoveredStateId =  null;

	map.on('load', function () {




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
	            
	            document.querySelector('#info').innerText = e.features[0].properties.name;
	            hoveredStateId = e.features[0].properties.id;
	            map.setFeatureState({source: 'states', id: hoveredStateId}, { hover: true});
	        }
	    });

	    // When the mouse leaves the state-fill layer, update the feature state of the
	    // previously hovered feature.
	    map.on("mouseleave", "state-fills", function() {
	        if (hoveredStateId) {
	            map.setFeatureState({source: 'states', id: hoveredStateId}, { hover: false});
	        }
	        hoveredStateId =  null;
	    });
	});
});
