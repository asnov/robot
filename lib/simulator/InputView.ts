'use strict';

import {ExtendedWindowObj} from '../types';

declare const window: ExtendedWindowObj;


const commands = {
	'move': () => {
		window.simulator.getCurrentRobot().move();
	},
	'left': () => {
		window.simulator.getCurrentRobot().left();
	},
	'right': () => {
		window.simulator.getCurrentRobot().right();
	},
	'place': (params) => {
		window.simulator.getCurrentRobot().place(params);
	},
	'stepai': () => {
		window.canvasView.stepAi();
	},
	'restart': () => {
		window.simulator.restart();
	}
};

export class InputView {

	commandBox = document.getElementById('command') as HTMLInputElement;

	processCommand(value) {
		this.commandBox.select(); // auto select all input for easier editing
		console.log(value);
		window.simulator.resetContents(); // remove previous status and errors

		const sanitizedValue = value.trim().toLocaleLowerCase(),
			sanitizedValueArray = sanitizedValue.split(' '),
			firstWordEntered = sanitizedValueArray.splice(0, 1)[0];

		const cmdMethod = commands[firstWordEntered];
		if (cmdMethod) {
			cmdMethod(sanitizedValueArray.join()); // call controller functions by name
		} else {
			window.simulator.printErrors('Incorrect command');
		}
	}
}
