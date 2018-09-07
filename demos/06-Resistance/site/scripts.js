let _data = false;
let _images = false;
let _state = false;
let _municipality = false;
let _group = false;
let _numParticipants;
let _numDays;
let _material;
let _damage;

updateScreen();
fetchData();
createForm();



function fetchData() {
	fetch(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/blockades.json`, {
		method: 'get'
	}).then((response) => {
		return response.json();
	}).then(function(data) {
		_data = data;
		createStates();

	}).catch((err) => {
		console.error(err)
	});
}

fetch(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/images.json`, {
	method: 'get'
}).then((response) => {
	return response.json();
}).then(function(data) {
	_images = data;
}).catch((err) => {
	console.error(err)
});


function createForm() {

	document.querySelector('a#back').addEventListener('click', (e) => {
		e.preventDefault();
		updateScreen('state');
	});

	document.querySelector('form').addEventListener('submit', (e) => {
		e.preventDefault();
		const numParticipants = parseInt(document.querySelector('#num-participants').value);
		const numDays = parseInt(document.querySelector('#num-days').value);
		const material = document.querySelector('#material').value;

		_numParticipants = numParticipants;
		_numDays = numDays;
		_material = material;

		const materialAmounts = {
			trucks: 12999,
			tires: 1272,
			people: 59,
			barriers: 124,
		};

		_damage = materialAmounts[_material] * numDays * numParticipants;

		updateScreen('results');
	})
}

function updateScreen(screen) {
	document.querySelectorAll('main section').forEach((section) => {
		section.classList.add('hidden');
	});

	document.querySelector('main#selection').classList.add('hidden');
	document.querySelector('main#results').classList.add('hidden');

	if (screen === 'state') {
		document.querySelector('main#selection').classList.remove('hidden');
		document.querySelector('#about').classList.remove('hidden');
		document.querySelector('#states').classList.remove('hidden');
		document.querySelector('form').reset();
	} else if (screen === 'municipality') {
		document.querySelector('main#selection').classList.remove('hidden');
		document.querySelector('#about').classList.remove('hidden');
		document.querySelector('#states').classList.remove('hidden');
		document.querySelector('#municipalities').classList.remove('hidden');
	} else if (screen === 'group') {
		document.querySelector('main#selection').classList.remove('hidden');
		document.querySelector('#about').classList.remove('hidden');
		document.querySelector('#states').classList.remove('hidden');
		document.querySelector('#municipalities').classList.remove('hidden');
		document.querySelector('#groups').classList.remove('hidden');
	} else if (screen === 'participants') {
		document.querySelector('main#selection').classList.remove('hidden');
		document.querySelector('#about').classList.remove('hidden');
		document.querySelector('#states').classList.remove('hidden');
		document.querySelector('#municipalities').classList.remove('hidden');
		document.querySelector('#groups').classList.remove('hidden');
		document.querySelector('#participants').classList.remove('hidden');
	} else if (screen === 'results') {
		document.querySelector('main#results').classList.remove('hidden');


		// const industriesList = document.createElement('ul');
		// _data[_state].industries.forEach((industry) => {
		// 	const industryItem = document.createElement('li');
		// 	industryItem.textContent = industry;
		// 	industriesList.appendChild(industryItem);
		// });

		const blockades = _data[_state].municipalities[_municipality].claim_groups[_group].entries;
		const blockadesList = document.createElement('ul');

		blockades.forEach((blockade, i) => {
			const blockadeItem = document.createElement('li');
			blockadeItem.insertAdjacentHTML( 'beforeend', `
				<div class="blockade">
					<div><a class="road" href="${blockade.road}" data-blockadeindex="${i}">${blockade.road}</a></div>
					<div>${blockade.date}</div>
					<div>${blockade.num_participants} participants</div>
				</div>	
			`);
			blockadesList.appendChild(blockadeItem);			
		});

		document.querySelector('#result-state').textContent = _state;
		// document.querySelector('#result-industries').appendChild(industriesList);
		document.querySelector('#result-industries').textContent = _data[_state].industries.join(', ');
		document.querySelector('#result-municipality').textContent = _municipality;
		document.querySelector('#result-group').textContent = _group;
		document.querySelector('#result-participants').textContent = _numParticipants;
		document.querySelector('#result-days').textContent = _numDays;
		document.querySelector('#result-material').textContent = _material;
		document.querySelector('#result-damage').textContent = _damage;
		document.querySelector('#result-blockades').appendChild(blockadesList);

		document.querySelectorAll('#result-blockades .blockade a.road').forEach((roadLink) => {
			roadLink.addEventListener('click', (e) => {
				e.preventDefault();
				const idx = e.target.dataset.blockadeindex;
				showBlockade(idx)				
			});
		});

		showBlockade(0);
	}
}

function showBlockade(idx) {
	const blockade = _data[_state].municipalities[_municipality].claim_groups[_group].entries[idx];
	
	document.querySelector('#blockade-road').textContent = blockade.road;
	document.querySelector('#blockade-grievance').textContent = blockade.type_of_claim_en;
	document.querySelector('#blockade-people').textContent = blockade.num_participants;
	document.querySelector('#blockade-date').textContent = blockade.date;

	console.log(_images.images);
	const img = new Image();



	img.addEventListener("error", () => {
		document.querySelector('.column.blockade').style.backgroundImage = `url(/images/${_images.images[Math.floor(Math.random() * _images.images.length)]}.png)`;
	});
	img.addEventListener("load", () => {
		document.querySelector('.column.blockade').style.backgroundImage = `url(/images/${blockade.road}.png)`;
	});
	img.src = `/images/${blockade.road}.png`;



	// /images/AM-254.png
	// document.querySelector('.column.blockade').style.backgroundImage = 'url(/images/AM-254.png)';
	
}

function createStates() {
	const list = document.querySelector('#states ul');
	
	while (list.hasChildNodes()) {
		list.removeChild(list.lastChild);
	}

	for (let state in _data) {
		const numBlockades = _data[state].num_entries;
		let label = (numBlockades > 1) ? 'blockades' : 'blockade';

		const claimGroups = _data[state].claim_groups_list.join(', ');
		const item = document.createElement('li');
		item.insertAdjacentHTML( 'beforeend', `
			<div>
				<div><a href="${state}" data-state="${state}">${state}</a></div>
				<div>${numBlockades} ${label}</div>
			</div>
		`);

		list.appendChild(item);
	}

	document.querySelectorAll('#states ul li a').forEach((a) => {
		a.addEventListener('click', (e) => {
			e.preventDefault();
			const state = e.target.dataset.state;
			_state = state;
			createMunicipalities();

		});
	});
	updateScreen('state');
}

function createMunicipalities() {
	const list = document.querySelector('#municipalities ul');
	
	while (list.hasChildNodes()) {
		list.removeChild(list.lastChild);
	}

	for (let municipality in _data[_state].municipalities) {
		const municipalityData = _data[_state].municipalities[municipality];

		const numBlockades = municipalityData.num_entries;
		let label = (numBlockades > 1) ? 'blockades' : 'blockade';

		const claimGroups = municipalityData.claim_groups_list.join(', ');
		const item = document.createElement('li');
		item.insertAdjacentHTML( 'beforeend', `
			<div>
				<div><a href="${municipality}" data-municipality="${municipality}">${municipality}</a></div>
				<div>${numBlockades} ${label}</div>
			</div>
		`);

		list.appendChild(item);
	}

	document.querySelectorAll('#municipalities ul li a').forEach((a) => {
		a.addEventListener('click', (e) => {
			e.preventDefault();
			const municipality = e.target.dataset.municipality;
			_municipality = municipality;
			createClaimGroups();
		});
	});
	updateScreen('municipality');
}

function createClaimGroups() {
	const list = document.querySelector('#groups ul');
	
	while (list.hasChildNodes()) {
		list.removeChild(list.lastChild);
	}

	for (let group in _data[_state].municipalities[_municipality].claim_groups) {
		
		const groupData = _data[_state].municipalities[_municipality].claim_groups[group];

		const numBlockades = groupData.num_entries;
		const claimGroups = groupData.claim_groups_list.join(', ');
		const item = document.createElement('li');
		let label = (numBlockades > 1) ? 'blockades' : 'blockade';
		item.insertAdjacentHTML( 'beforeend', `
			<div>
				<div><a href="${group}" data-group="${group}">${group}</a></div>
				<div>${numBlockades} ${label}</div>
			</div>
		`);

		list.appendChild(item);
	}

	document.querySelectorAll('#groups ul li a').forEach((a) => {
		a.addEventListener('click', (e) => {
			e.preventDefault();
			const group = e.target.dataset.group;
			_group = group;
			updateScreen('participants');
			// createClaimGroups();
		});
	});	
	updateScreen('group');
}

