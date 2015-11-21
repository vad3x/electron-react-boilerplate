import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Waveform extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._initInternal();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.channelData != this.props.channelData || prevProps.width != this.props.width || prevProps.height != this.props.height) {
            this._initInternal();
        }
    }

    render() {
        return (
            <svg className="waveform" height={this.props.height} width={this.props.width}>
                <path ref="waveform"></path>
            </svg>
        );
    }

    _initInternal() {
        this._node = ReactDOM.findDOMNode(this.refs.waveform);

        const width = this.props.width;
        const middle = this.props.height / 2;

        const step = Math.ceil(this.props.channelData.length / width);

        this._draw(width, step, middle, this.props.channelData, this._node);
    }

    _draw(width, step, middle, data, node) {
        console.log('wave draw');
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
                let datum = data[(i * step) + j];

                if (datum < min) {
                    min = datum;
                } else if (datum > max) {
                    max = datum;
                }
            }

            const x = i;
            const y = (1 + min) * middle;

            opposite.push({
                x, y: y + Math.max(1, (max - min) * middle)
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
