import { CvOutputProcessor } from './cvOutput'
import { BitCrusherProcessor } from './bitCrusher'
import { ClockProcessor } from './clock'
import { FrequencyProcessor } from './frequency'

// @ts-ignore
registerProcessor('cv-output-processor', CvOutputProcessor)
// @ts-ignore
registerProcessor('bitcrusher-processor', BitCrusherProcessor)
// @ts-ignore
registerProcessor('clock-processor', ClockProcessor)
// @ts-ignore
registerProcessor('frequency-processor', FrequencyProcessor)
