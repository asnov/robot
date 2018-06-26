'use strict';

import * as MainLoop from 'mainloop.js';

import {Robot} from './Robot';
import {Goal} from './Goal';
import {InputView} from './InputView';
import {ReportView} from './ReportView';
import {CanvasView} from './CanvasView';
import {ExtendedWindowObj} from '../types';

declare const window: ExtendedWindowObj;
export const NUMBER_OF_ROBOTS = 5;


export class Simulator {

	constructor() {
		window.inputView = new InputView();
		window.canvasView = new CanvasView();
		window.reportView = new ReportView();

		this.restart();

		const fpsEl = document.getElementById('fps') as HTMLDivElement;
		let updateCount = 0;
		let drawCount = 0;
		MainLoop
			.setUpdate((delta: number) => {
				// console.log(`update:`, delta, updateCount += delta);
			})
			.setDraw((interpolationPercentage: number) => {
				if (drawCount++ % 100 === 0) {
					// console.log(`draw:`, interpolationPercentage);
				}
				window.canvasView.render(window.robots, window.goal, interpolationPercentage);
			})
			.setEnd((fps, panic) => {
				fpsEl.innerHTML = `<p>${fps.toFixed(2)} FPS</p>`;
				if (panic) {
					var discardedTime = Math.round(MainLoop.resetFrameDelta());
					console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
				}
			})
			.start();

	}

	getRobotById(robotId: number) {
		return window.robots[robotId];
	}

	resetContents() {
		window.reportView.clear();
	};

	/* --------------------------------------------------- */

	/*         end of command functions
	 /* --------------------------------------------------- */
	printErrors(msg) {
		console.error(msg);
		window.reportView.renderErrors(msg);
	}

	restart() {
		window.goal = new Goal();
		window.robots = [];
		while (window.robots.length < NUMBER_OF_ROBOTS) {
			const newRobot = Robot.assemble(window.goal);
			// checking position is empty
			if (
				window.robots.some(robot => (
					robot.x === newRobot.x &&
					robot.y === newRobot.y)) ||
				window.goal.x === newRobot.x &&
				window.goal.y === newRobot.y
			) {
				continue;
			}
			window.robots.push(newRobot);
			console.log(`Robot "${newRobot.color}" positioned at ${newRobot.x}, ${newRobot.y}, ${newRobot.f}`);
		}
	}

}
