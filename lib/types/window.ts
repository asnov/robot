import {Simulator} from '../simulator/Simulator';
import {CanvasView} from '../simulator/CanvasView';

export interface ExtendedWindowObj extends Window {
	simulator: Simulator;
	canvasView: CanvasView;
}
