import {Simulator} from '../simulator/Simulator';

export interface ExtendedWindowObj extends Window {
	simulator: Simulator;
}
