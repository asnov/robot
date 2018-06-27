'use strict';

import {getRandomInt} from '../utils';
import {CanvasView} from './CanvasView';


export class Goal {

	x = getRandomInt(0, this.canvasView.maxX - 1);
	y = getRandomInt(0, this.canvasView.maxY - 1);

	constructor(private canvasView: CanvasView) {
		console.log(`Goal positioned at ${this.x}, ${this.y}`);
	}

}
