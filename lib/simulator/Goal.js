'use strict';

import {getRandomInt} from '../utils.js';

export class Goal {

	constructor() {
		this.x = getRandomInt(0, 4);
		this.y = getRandomInt(0, 4);
		console.log(`Goal positioned at ${this.x}, ${this.y}`);
	}

}
