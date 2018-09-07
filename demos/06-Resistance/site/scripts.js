let _data = false;
let _state = false;
let _municipality = false;
let _group = false;
let _numParticipants;
let _numMonths;

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


function createForm() {

	document.querySelector('a#back').addEventListener('click', (e) => {
		e.preventDefault();
		updateScreen('state');
	});

	document.querySelector('form').addEventListener('submit', (e) => {
		e.preventDefault();
		const numParticipants = parseInt(document.querySelector('#num-participants').value);
		const numMonths = parseInt(document.querySelector('#num-months').value);
		_numParticipants = numParticipants;
		_numMonths = numMonths;
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
		document.querySelector('#states').classList.remove('hidden');
		document.querySelector('form').reset();
	} else if (screen === 'municipality') {
		document.querySelector('main#selection').classList.remove('hidden');
		document.querySelector('#states').classList.remove('hidden');
		document.querySelector('#municipalities').classList.remove('hidden');
	} else if (screen === 'group') {
		document.querySelector('main#selection').classList.remove('hidden');
		document.querySelector('#states').classList.remove('hidden');
		document.querySelector('#municipalities').classList.remove('hidden');
		document.querySelector('#groups').classList.remove('hidden');
	} else if (screen === 'participants') {
		document.querySelector('main#selection').classList.remove('hidden');
		document.querySelector('#states').classList.remove('hidden');
		document.querySelector('#municipalities').classList.remove('hidden');
		document.querySelector('#groups').classList.remove('hidden');
		document.querySelector('#participants').classList.remove('hidden');
	} else if (screen === 'results') {
		document.querySelector('main#results').classList.remove('hidden');


		document.querySelector('#result-state').textContent = _state;
		document.querySelector('#result-industries').textContent = _data[_state].industries.join(', ');
		document.querySelector('#result-municipality').textContent = _municipality;
		document.querySelector('#result-group').textContent = _group;
		document.querySelector('#result-participants').textContent = _numParticipants;
		document.querySelector('#result-months	').textContent = _numMonths;
	}
}

function createStates() {
	const list = document.querySelector('#states ul');
	
	while (list.hasChildNodes()) {
		list.removeChild(list.lastChild);
	}

	for (let state in _data) {
		const numBlockades = _data[state].num_entries;
		const claimGroups = _data[state].claim_groups_list.join(', ');
		const item = document.createElement('li');
		item.insertAdjacentHTML( 'beforeend', `
			<div>
				<div><a href="${state}" data-state="${state}">${state}</a></div>
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
		const claimGroups = municipalityData.claim_groups_list.join(', ');
		const item = document.createElement('li');
		item.insertAdjacentHTML( 'beforeend', `
			<div>
				<div><a href="${municipality}" data-municipality="${municipality}">${municipality}</a></div>
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
		item.insertAdjacentHTML( 'beforeend', `
			<div>
				<div><a href="${group}" data-group="${group}">${group}</a></div>
				<div>Blockades: ${numBlockades}</div>
			</div>
		`);

		list.appendChild(item);
	}

	document.querySelectorAll('#groups ul li a').forEach((a) => {
		a.addEventListener('click', (e) => {
			e.preventDefault();
			const group = e.target.dataset.group;
			_group = group;
			console.log(group);

			updateScreen('participants');
			// createClaimGroups();

		});
	});	
	updateScreen('group');
}

