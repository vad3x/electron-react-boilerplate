import React, { Component } from 'react';
import styles from './WaveformControl.module.less';

import Waveform from './Waveform';

export default class WaveformControl extends Component {
  static propTypes = {
    audioBuffer: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  componentDidMount() {
    const { audioBuffer } = this.props;

    if (audioBuffer) {
      const channelData = audioBuffer.getChannelData(0, 1, 1);

      this._channelData = channelData;
    }
  }

  componentWillUpdate(nextProps) {
    const { audioBuffer } = this.props;

    if (nextProps.audioBuffer !== audioBuffer) {
      const channelData = nextProps.audioBuffer.getChannelData(0, 1, 1);

      this._channelData = channelData;
    }
  }

  render() {
    const { width, height } = this.props;

    let body;
    if (this._channelData) {
      body = <Waveform channelData={this._channelData} height={height} width={width} />;
    } else {
      body = <span>Nothing To Render</span>;
    }

    return (
      <div className={styles.waveformControl}>
        {body}
      </div>
    );
  }
}

WaveformControl.defaultProps = {
  audioBuffer: null
};
