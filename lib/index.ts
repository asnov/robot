import 'style.css';

import {Simulator} from './simulator/Simulator';
import {ExtendedWindowObj} from './types';


declare const window: ExtendedWindowObj;


window.simulator = new Simulator();
