'use strict';

import {getRandomInt} from '../utils';


export class Goal {

	x = getRandomInt(0, 4);
	y = getRandomInt(0, 4);

	constructor() {
		console.log(`Goal positioned at ${this.x}, ${this.y}`);
	}

}
