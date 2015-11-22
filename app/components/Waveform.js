import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './Waveform.module.less';

export default class Waveform extends Component {
  static propTypes = {
    channelData: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  componentDidMount() {
    this._initInternal();
  }

  componentDidUpdate(prevProps) {
    const { channelData, width, height } = this.props;

    if (prevProps.channelData !== channelData || prevProps.width !== width || prevProps.height !== height) {
      this._initInternal();
    }
  }

  render() {
    const { width, height } = this.props;

    return (
      <svg className={styles.waveform} height={height} width={width}>
        <path ref="waveform"></path>
      </svg>
    );
  }

  _initInternal() {
    const { channelData, width, height } = this.props;

    this._node = ReactDOM.findDOMNode(this.refs.waveform);

    const middle = height / 2;

    const step = Math.ceil(channelData.length / width);

    this._draw(width, step, middle, channelData, this._node);
  }

  _draw(width, step, middle, data, node) {
    const segments = node.pathSegList;
    segments.clear();

    const firstSegment = node.createSVGPathSegMovetoAbs(0, middle);
    segments.appendItem(firstSegment);

    const opposite = [];

    // left channel
    for (let i = 0; i < width; i += 1) {
      let min = 1.0;
      let max = -1.0;

      for (let j = 0; j < step; j += 1) {
        const datum = data[(i * step) + j];

        if (datum < min) {
          min = datum;
        } else if (datum > max) {
          max = datum;
        }
      }

      const x = i;
      const y = (1 + min) * middle;

      opposite.push({
        x,
        y: y + Math.max(1, (max - min) * middle)
      });

      const newSegment = node.createSVGPathSegLinetoAbs(x, y);
      segments.appendItem(newSegment);
    }

    // right channel
    for (let i = width - 1; i >= 0; i--) {
      const p = opposite[i];

      const newSegment = node.createSVGPathSegLinetoAbs(p.x, p.y);
      segments.appendItem(newSegment);
    }

    const closeSegment = node.createSVGPathSegClosePath();
    segments.appendItem(closeSegment);
  }
}

Waveform.defaultProps = {
  channelData: null,
  width: 1200,
  height: 100
};
