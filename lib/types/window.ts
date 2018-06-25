import {InputView} from '../simulator/InputView';
import {Robot} from '../simulator/Robot';
import {Goal} from '../simulator/Goal';
import {ReportView} from '../simulator/ReportView';
import {Simulator} from '../simulator/Simulator';
import {CanvasView} from '../simulator/CanvasView';

export interface ExtendedWindowObj extends Window {
	simulator: Simulator;
	inputView: InputView;
	canvasView: CanvasView;
	reportView: ReportView;
	robot: Robot;
	goal: Goal;
}
