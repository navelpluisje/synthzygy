import { BitCrusherProcessor } from './bitCrusher';
import { ClockProcessor } from './clock';
import { FrequencyProcessor } from './frequency';
import { GateInputProcessor } from './gateInput';

registerProcessor('bitcrusher-processor', BitCrusherProcessor);
registerProcessor('clock-processor', ClockProcessor);
registerProcessor('frequency-processor', FrequencyProcessor);
registerProcessor('gateinput-processor', GateInputProcessor);
