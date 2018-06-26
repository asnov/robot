'use strict';
import {Robot} from './Robot';

export const REPORT_ELEMENT_ID = 'report';
export const ERROR_ELEMENT_ID = 'error';

export class ReportView {

	reportMessageEle = document.getElementById(REPORT_ELEMENT_ID) as HTMLDivElement;
	errorMessageEle = document.getElementById(ERROR_ELEMENT_ID) as HTMLDivElement;

	renderReport(robots: Robot[]) {
		let reportText = '';
		for (let i = 0; i < robots.length; i++) {
			const currentRobot = robots[i];
			reportText += `<p>${i}:
					<span>Axis X: ${currentRobot.x}</span>
					<span>Axis Y: ${currentRobot.y}</span>
					<span>Facing: ${currentRobot.f}</span>
				</p>`;
		}
		this.reportMessageEle.innerHTML = reportText;
	}

	renderErrors(msg) {
		this.errorMessageEle.innerHTML = '<span id="error">' + msg + '</span>';
	}

	clear() {
		this.reportMessageEle.innerHTML = '';
		this.errorMessageEle.innerHTML = '';
	}

}
