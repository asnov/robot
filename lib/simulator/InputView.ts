'use strict';

import {ExtendedWindowObj} from '../types';
import {Robot} from './Robot';

declare const window: ExtendedWindowObj;

function commands(currentRobot: Robot) {
	return {
		'move': () => currentRobot.move(),
		'left': () => currentRobot.left(),
		'right': () => currentRobot.right(),
		'place': (params) => currentRobot.place(params),
		'stepai': () => currentRobot.stepAi(),
		'restart': () => window.simulator.restart(),
	};
}


export class InputView {

	commandBox = document.getElementById('command') as HTMLInputElement;

	constructor() {
		this.commandBox.addEventListener('keypress', event => {
			if (event.keyCode === 13) {
				const el = event.target as HTMLInputElement;
				this.processCommand(el.value);
			}
		});
	}

	processCommand(value: string) {

		this.commandBox.select(); // auto select all input for easier editing
		console.log(value);
		window.simulator.resetContents(); // remove previous status and errors

		const sanitizedValue = value.trim().toLocaleLowerCase(),
			sanitizedValueArray = sanitizedValue.split(' '),
			firstWordEntered = sanitizedValueArray.shift();
		let robotId: number = +firstWordEntered;
		let command: string;

		if (robotId >= 0) {
			command = sanitizedValueArray.shift();
		} else {
			robotId = 0;
			command = firstWordEntered;
		}

		const currentRobot = window.simulator.getRobotById(robotId);
		if (currentRobot) {
			const cmdMethod: Function = commands(currentRobot)[command];
			if (cmdMethod) {
				cmdMethod(sanitizedValueArray.join()); // call controller functions by name
				return;
			}
		}
		window.simulator.printErrors('Incorrect command');
	}

}
