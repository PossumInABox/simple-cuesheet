class Track {

	constructor(title, cuePoint) {
		if (title !== '') {
			this.title = title;
		} else {
			throw {name:'InvalidInputException', message:'Invalid track title'};
		}

		if (cuePoint.match('[0-9][0-9]:[0-9][0-9]:[0-9][0-9]')) {
			this.cuePoint = cuePoint;
		} else {
			throw {name:'InvalidInputException', message:'Invalid cue point'};
		}

	}

	toString() {

		return ('TITLE "' + this.title + '"\nINDEX 01 ' + this.cuePoint);

	}



}
