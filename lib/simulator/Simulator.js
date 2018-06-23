'use strict';

import MainLoop from 'mainloop.js';

import {Robot} from './Robot';
import {Goal} from './Goal';
import {InputView} from './InputView';
import {ReportView} from './ReportView';
import {CanvasView} from './CanvasView';

export class Simulator {
	constructor() {
		window.inputView = new InputView();
		window.canvasView = new CanvasView();
		window.reportView = new ReportView();

		this.restart();

		MainLoop
		.setUpdate(() => {
		})
		.setDraw(() => {
			window.canvasView.render();
		})
		.start();

	}

	getCurrentRobot() {
		return window.robot;
	}

	resetContents() {
		window.reportView.clear();
	};

	/* --------------------------------------------------- */
	/*         end of command functions
	 /* --------------------------------------------------- */
	printErrors(msg) {
		window.reportView.renderErrors(msg);
	}

	restart() {
		window.robot = new Robot();
		window.goal = new Goal();
	}

};
