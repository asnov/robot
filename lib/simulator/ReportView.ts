'use strict';
import {ExtendedWindowObj} from '../types';

declare const window: ExtendedWindowObj;


export class ReportView {

	// errorMessageEle = document.getElementById("error");
	reportMessageEle = document.getElementById('report');

	renderReport() {
		var currentRobot = window.simulator.getCurrentRobot();
		this.reportMessageEle.innerHTML = '<span>' + 'Axis X: ' + currentRobot.x + '</span>' +
			'<span>' + 'Axis Y: ' + currentRobot.y + '</span>' +
			'<span>' + 'Facing: ' + currentRobot.f + '</span>';
	}

	renderErrors(msg) {
		this.reportMessageEle.innerHTML = '<span id="error">' + msg + '</span>';
	}

	clear() {
		this.reportMessageEle.innerHTML = '';
		//        this.errorMessageEle.innerHTML = '';
	}
}
