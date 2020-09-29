function setDarkMode() {
	document.querySelector('body').classList = 'darkmode';
	document.getElementById('sw_light').style.display = 'block';
	document.getElementById('sw_dark').style.display = 'none';
}

function setLightMode() {
	document.querySelector('body').classList = 'lightmode';
	document.getElementById('sw_light').style.display = 'none';
	document.getElementById('sw_dark').style.display = 'block';
}

function render() {

	document.getElementById('outputBox').innerText = myAlbum.toString();

	let trackTable = '';
	for (let i = 0; i < myAlbum.tracks.length; i++) {
		let currentLine = '<tr><td>' + (i+1) + '</td><td>' + myAlbum.tracks[i].title + '<span class="delete" data-title="' + myAlbum.tracks[i].title + '" onclick="deleteTrack(this)">-</span></td>';

		let currentLength = '';
		if (myAlbum.tracks.length === 1) {
			currentLength = compareTimes('00:00:00', myAlbum.duration);
		}
		if (i+1 < myAlbum.tracks.length) {
			currentLength = compareTimes(myAlbum.tracks[i].cuePoint, myAlbum.tracks[i+1].cuePoint);
		}

		if (i+1 === myAlbum.tracks.length) {
			currentLength = compareTimes(myAlbum.tracks[i].cuePoint, myAlbum.duration);
		}

		currentLine += '<td>' + currentLength + '</td>';

		trackTable += currentLine;
	}

	document.getElementById('trackTable').innerHTML = trackTable;

	document.getElementById('jsonout').innerText = JSON.stringify(myAlbum);

}

function setAlbum() {

	let artist = document.querySelector('#artist').value;
	let albumTitle = document.querySelector('#albumTitle').value;
	let albumDuration = document.querySelector('#duration').value;



	try {
		if (typeof myAlbum !== 'undefined') {
			myAlbum.artist = artist;
			myAlbum.title = albumTitle;
			myAlbum.duration = albumDuration;
		} else {
			myAlbum = new Album(artist, albumTitle, albumDuration);
		}

		render();
	} catch (e) {
		alert(e.message);
	}

}

function addTrack() {

	let title = document.querySelector('#trackTitle').value;
	let cuePoint = document.querySelector('#cuePoint').value;

	try {
		myAlbum.addTrack(title, cuePoint);
		document.querySelector('#trackTitle').value = '';
		document.querySelector('#cuePoint').value = '';

		render();

	} catch (e) {
		alert(e.message);
	}


}

function deleteTrack(trackItem) {
	myAlbum.deleteTrack(trackItem.dataset.title);
	render();
}

function clearTracks() {
	myAlbum.clearTracks();
	render();
}

function persist() {

	localStorage.setItem('cuesheet_album', JSON.stringify(myAlbum));

}

function loadFromLocal() {
	let loaded = localStorage.getItem('cuesheet_album');
	try {
		load(loaded);
	} catch (e) {
		alert(e.message);
	}
}

function loadFromJSONInput() {
	let loaded = document.getElementById('textIn').value;
	try {
		load(loaded);
		document.getElementById('jsonin').value = '';
	} catch (e) {
		alert(e.message);
	}
}

function loadFromTextInput() {
	let loaded = document.getElementById("textIn").value;
	let loadedLines = loaded.split("\n");
	for(let i=0; i<loadedLines.length; i++) {
		let currentLineList = loadedLines[i].split(" - ");
		let currentCue = currentLineList[0] + ":00";
		let currentTitle = currentLineList[1];
		myAlbum.addTrack(currentTitle, currentCue);
		render();
	}

}


function load(loaded) {

	let parsed = JSON.parse(loaded);
	myAlbum = new Album(parsed.artist, parsed.title, parsed.duration);

	for (let i=0; i < parsed.tracks.length; i++) {
		myAlbum.addTrack(parsed.tracks[i].title, parsed.tracks[i].cuePoint);
	}

	document.querySelector('#artist').value = myAlbum.artist;
	document.querySelector('#albumTitle').value = myAlbum.title;
	document.querySelector('#duration').value = myAlbum.duration;

	render();

}

function compareTimes(time1, time2) {

	let timeList1 = time1.split(':');
	let timeList2 = time2.split(':');
	let timeList3 = [0,0,0];

	let validTime = false;
	for (let j = 0; j < timeList1.length; j++) {
		if (timeList1[j] < timeList2[j]) {
			validTime = true
		}
	}
	if (!validTime) throw {name: 'InvalidTimeException', message: 'A supposedly later time cannot be lower or equal'};

	for (let i = timeList1.length -1; i >= 0; i--) {
		let diff = timeList2[i] - timeList1[i];
		if (diff + timeList3[i] < 0) {
			timeList3[i-1]--;
			diff = 60 + diff
		}
		timeList3[i] = timeList3[i] + diff;
	}

	for (let k = 0; k < timeList3.length; k++) {
		if (timeList3[k] < 10 && timeList3[k] > -1) {
			timeList3[k] = '0' + timeList3[k];
		}
	}

	return timeList3.join(':');
}


