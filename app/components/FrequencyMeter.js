import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import styles from './FrequencyMeter.module.less';

export default class FrequencyMeter extends Component {
  static propTypes = {
    audioContext: React.PropTypes.object,
    audioSource: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    bandsCount: React.PropTypes.number,
    latency: React.PropTypes.number,
    fftSize: React.PropTypes.number
  }

  componentDidMount() {
    const { audioSource } = this.props;

    this._frequencyNode = ReactDOM.findDOMNode(this.refs.frequency);

    if (audioSource) {
      this._initInternal();
    }
  }

  componentDidUpdate() {
    const { audioSource } = this.props;
    if (audioSource) {
      this._initInternal();
    }
  }

  render() {
    const { width, height } = this.props;

    const min = 20;
    const max = 23000;

    var minp = 0;
    var maxp = width;

    const minv = Math.log(min);
    const maxv = Math.log(max);

    const scale = ((maxv - minv) / (maxp - minp));

    const freqToDraw = [50, 100, 200, 500, 1000, 2000, 5000, 10000];

    const topMargin = 12;
    const freqLines = [];
    for (const i in freqToDraw) {

      const f = freqToDraw[i];

      const x = Math.ceil((Math.log(f) - minv) / scale + minp);

      const line = <line key={i} strokeWidth="1" x1={x} x2={x} y1={topMargin} y2={height}></line>;
      freqLines.push(line);
    }

    const freqToTitle = [40, 100, 200, 400, 600, 1000, 2000, 4000, 6000, 10000];
    const freqTitles = [];

    for (const i in freqToTitle) {

      const f = freqToTitle[i];

      const x = Math.ceil((Math.log(f) - minv) / scale + minp) - 10;

      const text = <text key={i} x={x} y={10}>{f < 1000 ? f : `${f / 1000}k`}</text>;
      freqTitles.push(text);
    }

    return (
      <svg className={styles.frequencyMeter} height={height} width={width}>
        {freqLines}
        {freqTitles}
        <path fill="transparent" ref="frequency"></path>
      </svg>
    );
  }

  _initInternal() {
    const { audioContext, audioSource, latency, fftSize, width, height } = this.props;
    this._buffer = new Uint8Array(this.props.fftSize / 2);

    const audioAnalyser = audioContext.createAnalyser();

    audioAnalyser.fftSize = fftSize;
    audioAnalyser.minDecibels = -90;
    audioAnalyser.maxDecibels = -10;
    audioAnalyser.smoothingTimeConstant = 0.9;

    audioSource.connect(audioAnalyser);

    this._frequencyNode.pathSegList.clear();
    const playingInterval = setInterval(() => this._renderFrame(audioAnalyser, width, height), latency);

    audioSource.onended = () => {
      clearInterval(playingInterval);
    };
  }

  _drawFrequency(min, max, width, height, data, node) {
    var minp = 0;
    var maxp = width;

    const segments = node.pathSegList;
    if (!segments.length) {
      const newSegment = node.createSVGPathSegMovetoAbs(0, height);
      segments.appendItem(newSegment);

      for (let i = 1; i < data.length; i++) {
        const newSegment1 = node.createSVGPathSegLinetoAbs(10, 20);
        segments.appendItem(newSegment1);
      }
    }

    const minv = Math.log(min);
    const maxv = Math.log(max);

    const scale = ((maxv - minv) / (maxp - minp));

    for (let i = 0; i < data.length; i++) {
      const value = data[i];

      let x = (Math.log(i) - minv) / scale + minp;

      if (!i) {
        x = 0;
      }

      const h = (height * value) / 256;
      const y = height - h;

      const point = segments.getItem(i);

      point.x = x;
      point.y = y;
    }
  }

  _renderFrame(analyser, width, height) {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    this._drawFrequency(1, frequencyData.length, width, height, frequencyData, this._frequencyNode);
  }
}

FrequencyMeter.defaultProps = {
  audioContext: null,
  audioSource: null,
  width: 800,
  height: 300,
  bandsCount: 1024,
  latency: 20,
  fftSize: 1024 * 2
};
