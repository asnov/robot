import {ERROR_ELEMENT_ID, REPORT_ELEMENT_ID, ReportView} from './ReportView';
import Spy = jasmine.Spy;
import {Robot, SIDES_OF_THE_WORLD} from './Robot';

declare const global;

/*********************************************************
 * External dependencies
 *********************************************************/
const trivialDOM = {
	[REPORT_ELEMENT_ID]: {
		innerHTML: 'some old text in the report field',
	},
	[ERROR_ELEMENT_ID]: {
		innerHTML: 'some old text in the error field',
	},
};

global.document = {
	getElementById(elementId: string) {
		return trivialDOM[elementId];
	}
};


describe('ReportView', () => {
	let getElementById: Spy;
	let reportView: ReportView;

	beforeEach(() => {
		getElementById = spyOn(global.document, 'getElementById').and.callThrough();
		reportView = new ReportView();
	});

	it('should be created', () => {
		expect(reportView).toBeTruthy();
		expect(getElementById.calls.count()).toBe(2);
	});

	it(`should request html element with the "${REPORT_ELEMENT_ID}" id`, () => {
		expect(getElementById.calls.first().args.length).toEqual(1);
		expect(getElementById.calls.first().args[0]).toEqual(REPORT_ELEMENT_ID);
	});

	it(`should request html element with the "${ERROR_ELEMENT_ID}" id`, () => {
		expect(getElementById.calls.mostRecent().args.length).toEqual(1);
		expect(getElementById.calls.mostRecent().args[0]).toEqual(ERROR_ELEMENT_ID);
	});

	describe('.renderReport()', () => {
		const dummyRobots = [
			{x: 0, y: 0, f: SIDES_OF_THE_WORLD[0]},
			{x: 20, y: 0, f: SIDES_OF_THE_WORLD[2]},
			{x: 0, y: 9, f: SIDES_OF_THE_WORLD[3]},
			{x: 99, y: 100, f: SIDES_OF_THE_WORLD[1]},
		];

		beforeEach(() => {
			reportView.renderReport(dummyRobots as Robot[]);
		});

		it('should display robot positions', () => {
			const result = trivialDOM[REPORT_ELEMENT_ID].innerHTML;
			for (let robot of dummyRobots) {
				expect(result).toContain(`Axis X: ${robot.x}`);
				expect(result).toContain(`Axis Y: ${robot.y}`);
				expect(result).toContain(`Facing: ${robot.f}`);
			}

			// const regStr = RegExp(`.*Axis X: ${dummyRobots[0].x}<\/span>.*<span>Axis Y: ${dummyRobots[0].y}.*`, 'im');
			// expect(result)
			// 	.toEqual(jasmine.stringMatching(
			// 		regStr
			// 	));
		});

	});

	describe('.renderErrors()', () => {
		const errorMessage = 'test error message.';

		beforeEach(() => {
			reportView.renderErrors(errorMessage);
		});

		it('should show error', () => {
			const result = trivialDOM[ERROR_ELEMENT_ID].innerHTML;
			expect(result).toContain(errorMessage);
		});

	});

	describe('.clear()', () => {

		beforeEach(() => {
			reportView.clear();
		});

		it('should clear both html elements', () => {
			expect(trivialDOM[REPORT_ELEMENT_ID].innerHTML).toBe('');
			expect(trivialDOM[ERROR_ELEMENT_ID].innerHTML).toBe('');
		});
	});

});
