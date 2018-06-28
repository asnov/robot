'use strict';
import {Robot} from './Robot';

export const REPORT_ELEMENT_ID = 'report';
export const ERROR_ELEMENT_ID = 'error';
export const FPS_COUNTER_ELEMENT_ID = 'fpscounter';
export const INFO_ELEMENT_ID = 'info';

export class ReportView {

	reportMessageEle = document.getElementById(REPORT_ELEMENT_ID) as HTMLDivElement;
	errorMessageEle = document.getElementById(ERROR_ELEMENT_ID) as HTMLDivElement;
	fpsCounterEle = document.getElementById(FPS_COUNTER_ELEMENT_ID) as HTMLDivElement;
	infoEle = document.getElementById(INFO_ELEMENT_ID) as HTMLDivElement;

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

	showFps(fps: number) {
		this.fpsCounterEle.textContent = Math.round(fps) + ' FPS';
	}

	clear() {
		this.reportMessageEle.innerHTML = '';
		this.errorMessageEle.innerHTML = '';
	}

}
