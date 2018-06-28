import {CanvasView, FIELD_ELEMENT_ID} from './CanvasView';
import createSpyObj = jasmine.createSpyObj;
import {Point, Wall} from '../utils';

declare const global;

/*********************************************************
 * External dependencies
 *********************************************************/
const trivialDOM = {
	[FIELD_ELEMENT_ID]: {
		width: 0,
		height: 0,

		getContext(contextId: string) {
			if (contextId === '2d') {
				return createSpyObj([
					'clearRect',
					'strokeStyle',
					'moveTo',
					'lineTo',
					'strokeText',
					'stroke',
					'fillStyle',
					'fill',
				]);
			}
		},

	},
};

global.document = {
	getElementById(elementId: string) {
		return trivialDOM[elementId];
	}
};


describe('CanvasView', () => {
	let canvasView: CanvasView;

	beforeEach(() => {
		canvasView = new CanvasView();
	});

	it('should be created', () => {
		expect(canvasView).toBeTruthy();
	});

	describe('.generateOneWall()', () => {
		let existingWalls: Wall[] = [
			new Wall(new Point(0, 0), new Point(1, 0)),
		];
		let newWalls: Wall[] = canvasView.addOneWall(existingWalls);
		// beforeEach(() => {
		// });

		it('should add a new wall to the array', () => {
			expect(newWalls.length).toBe(existingWalls.length + 1);
		});

		it('should generate connected wall if start value is given', () => {

		});

		it('should not generate the wall on the wall', () => {

		});
	});

	describe('.buildTheWall()', () => {
		it('should build a ');
	});

	describe('.generateWalls()', () => {

		it('should generate required amount of walls', () => {
			const theWall = canvasView.generateWalls(3);
			expect(theWall.length).toBe(3);
		});

	});

	describe('.buildTheWall()', () => {
		it('should build a ');
	});

});
