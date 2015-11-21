import React, { Component } from 'react';

import Waveform from 'Waveform';

export default class WaveformControl extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.audioBuffer) {
            const channelData = this.props
                .audioBuffer
                .getChannelData(0, 1, 1);

            this._channelData = channelData;
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.audioBuffer != this.props.audioBuffer) {
            const channelData = nextProps.audioBuffer
                .getChannelData(0, 1, 1);

            this._channelData = channelData;
        }
    }

    render() {
        let body;
        if (this._channelData) {
            body = <Waveform channelData={this._channelData} height={this.props.height} width={this.props.width}></Waveform>;
        } else {
            body = <span>Nothing To Render</span>;
        }

        return (
            <div className="waveform-control">
                {body}
            </div>
        );
    }
}

WaveformControl.defaultProps = {
    audioBuffer: null
};
