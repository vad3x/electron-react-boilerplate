import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import styles from './WaveformControl.module.less';

import Waveform from './Waveform';

export default class WaveformControl extends Component {
  static propTypes = {
    audioContext: React.PropTypes.object,
    audioSource: React.PropTypes.object,
    audioBuffer: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    latency: React.PropTypes.number,
    needleSearch: React.PropTypes.func.isRequired,
    time: React.PropTypes.number
  }

  constructor(props) {
    super(props);

    this.state = {
      timeOffset: 0,
      needleTime: 0,
      currentTime: 0
    };
  }

  componentDidMount() {
    const { audioBuffer } = this.props;

    if (audioBuffer) {
      const channelData = audioBuffer.getChannelData(0, 1, 1);

      this._channelData = channelData;

      this.state.timeOffset = audioContext.currentTime;
    }
  }

  componentWillUpdate(nextProps) {
    const { audioBuffer } = this.props;

    if (nextProps.audioBuffer !== audioBuffer) {
      const channelData = nextProps.audioBuffer.getChannelData(0, 1, 1);

      this._channelData = channelData;

      const node = ReactDOM.findDOMNode(this);
      node.addEventListener('click', (e) => this._onNeedleSearch(e, node, nextProps.audioBuffer.duration, nextProps.needleSearch));
    }
  }

  componentDidUpdate() {
    const { audioContext, audioSource, audioBuffer, needleSearch, time, latency } = this.props;

    const node = ReactDOM.findDOMNode(this);
    this._needleNode = ReactDOM.findDOMNode(this.refs.needle);

    if (this._playingInterval) {
      clearInterval(this._playingInterval);
      this._playingInterval = null;

      needleSearch(this.state.currentTime);
    }

    if (audioSource) {
      this.state.timeOffset = audioContext.currentTime;
      this._playingInterval = setInterval(() => this._moveNeedle(node, audioContext, audioBuffer.duration, time), latency);
    }
  }

  _moveNeedle(node, audioContext, duration, needleTime) {
    const clientWidth = node.clientWidth;

    const t = this.state.currentTime = (audioContext.currentTime - this.state.timeOffset) + needleTime;
    const v = t / duration;
    const offset = v * clientWidth;

    this._needleNode.style.left = offset + 'px';
  }

  _onNeedleSearch(event, node, duration, needleSearch) {
    const clientWidth = node.clientWidth;
    const mouseOffset = event.offsetX;

    const v = mouseOffset / clientWidth;
    const time = v * duration;

    this._needleNode.style.left = mouseOffset + 'px';

    needleSearch(time);
  }

  render() {
    const { width, height, latency } = this.props;

    let body;
    if (this._channelData) {
      body = (
              <div>
                <Waveform channelData={this._channelData} height={height} width={width} latency={latency} />
                <div className={styles.needle} ref="needle"></div>
              </div>
              );
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
  audioBuffer: null,
  latency: 20
};
