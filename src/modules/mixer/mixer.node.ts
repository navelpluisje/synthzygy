import { createGainNode } from '@utilities/createGain';

interface Channel {
  node: GainNode;
  mute: boolean;
  value: number;
}

export class MixerNode {
  private context: AudioContext;
  private audioOut: Channel = {
    mute: false,
    node: null,
    value: 0.5,
  };
  private channels: Record<string, Channel> = {
    1: {
      mute: false,
      node: null,
      value: 0.5,
    },
    2: {
      mute: false,
      node: null,
      value: 0.5,
    },
    3: {
      mute: false,
      node: null,
      value: 0.5,
    },
    4: {
      mute: false,
      node: null,
      value: 0.5,
    },
  };

  constructor(
    context: AudioContext,
    frequency: number = 0,
  ) {
    this.context = context;
    this.createGainNodes();
  }

  public createGainNodes() {
    this.audioOut.node = createGainNode(this.context, 0.5);
    Object.values(this.channels).forEach((channel) => {
      channel.node = createGainNode(this.context, channel.value);
      channel.node.connect(this.audioOut.node);
    });
  }

  public getAudioNode(index: string): GainNode {
    switch (index) {
      case 'out':
        return this.audioOut.node;
      default :
        return this.channels[index].node;
    }
  }

  public setAudio = (index: string): (value: number) => void => {
    return (value: number) => {
      let newValue = value;
      if (index === 'out') {
        this.audioOut.value = value;
      } else {
        this.channels[index.toString()].value = value;
        newValue = this.channels[index.toString()].mute ? 0 : value;
      }
      this.getAudioNode(index).gain.setTargetAtTime(newValue, this.context.currentTime, 0.001);
    };
  }

  public setMute = (index: string): (mute: boolean) => void => {
    return (mute: boolean) => {
      this.channels[index.toString()].mute = mute;
      this.getAudioNode(index).gain.setTargetAtTime(
        mute ? 0 : this.channels[index.toString()].value,
        this.context.currentTime,
        0.001,
      );
    };
  }

  public getAudio(index: string): number {
    return this.channels[index].value;
  }

  public input(index: string): GainNode {
    return this.channels[index].node;
  }

  public output(): GainNode {
    return this.audioOut.node;
  }
}
