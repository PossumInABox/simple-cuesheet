function render() {

	document.getElementById('outputBox').innerText = myAlbum.toString();

}

function setAlbum() {

	let artist = document.querySelector('#artist').value;
	let albumTitle = document.querySelector('#albumTitle').value;

	try {
		if (typeof myAlbum !== 'undefined') {
			myAlbum.artist = artist;
			myAlbum.title = albumTitle;
		} else {
			myAlbum = new Album(artist, albumTitle);
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

function clearTracks() {
	myAlbum.clearTracks();
	render();
}

function persist() {

	localStorage.setItem('cuesheet_album', JSON.stringify(myAlbum));

}

function load() {


	let loaded = localStorage.getItem('cuesheet_album');


	let parsed = JSON.parse(loaded);
	myAlbum = new Album(parsed.artist, parsed.title);

	for (let i=0; i < parsed.tracks.length; i++) {
		myAlbum.addTrack(parsed.tracks[i].title, parsed.tracks[i].cuePoint);
	}

	document.querySelector('#artist').value = myAlbum.artist;
	document.querySelector('#albumTitle').value = myAlbum.title;


	render();


}

