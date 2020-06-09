class Track {

	constructor(title, cuePoint) {
		this.title = title;
		this.cuePoint = cuePoint;

	}

	toString() {

		return ('TITLE "' + this.title + '"\nINDEX 01 ' + this.cuePoint);

	}



}
