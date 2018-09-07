const min = 1984;
const max = 2016;

document.addEventListener('DOMContentLoaded', function(){

	document.querySelector('#slider').min = min;
	document.querySelector('#slider').max = max;

	document.querySelector('#slider').addEventListener('input', function(){
		
		document.querySelector('#map').style.backgroundImage = 'url(../data/'+this.value+'.jpg)';
		document.querySelectorAll('#map div').forEach(function(el){
			el.style.display = 'none';
		});
		document.querySelector('#year-'+this.value).style.display = 'block';
	
		let year = document.createElement('div');
		year.innerHTML = `<h1>${this.value}</h1>`;
		document.querySelector('#info').innerHTML = '';
		document.querySelector('#info').appendChild(year);

	});
	const images = [];
	
	for(var i = min; i <= max; i++){
		images.push('../data/'+i+'.jpg');
		let mapImage = document.createElement('div');
		mapImage.style.backgroundImage = 'url(../data/'+i+'.jpg)';
		mapImage.id = 'year-'+i;
		document.querySelector('#map').appendChild(mapImage);
	}


});

// fetch('http://localhost:3000/data', {
// 	method: 'get'
// }).then((response) => {
// 	return response.json();
// }).then(function(data) {

// 	console.log(data);

// }).catch((err) => {
// 	console.error(err)
// });
