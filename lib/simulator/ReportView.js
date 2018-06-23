'use strict';

export class ReportView {
	constructor() {
		//        this.errorMessageEle = document.getElementById("error");
		this.reportMessageEle = document.getElementById("report");
	}

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
