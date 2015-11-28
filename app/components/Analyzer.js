import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './Counter.module.css';

import FrequencyMeter from './FrequencyMeter';
import WaveformControl from './WaveformControl';

class Analyzer extends Component {
  static propTypes = {
    selectFile: PropTypes.func.isRequired,
    play: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    needleSearch: PropTypes.func.isRequired,
    setNeedle: PropTypes.func.isRequired,
    dialog: PropTypes.object.isRequired,
    currentWindow: PropTypes.object.isRequired,
    analyzer: PropTypes.object.isRequired
  }

  render() {
    const { selectFile, play, stop, needleSearch, setNeedle, dialog, currentWindow, analyzer } = this.props;

    return (
      <div>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`}>
          {analyzer.filePath}
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={() => selectFile(dialog, currentWindow)}>selectFile</button>
          <button className={styles.btn} onClick={play}>Play</button>
          <button className={styles.btn} onClick={stop}>Stop</button>
        </div>
        <WaveformControl
          audioContext={analyzer.audioContext}
          audioSource={analyzer.audioSource}
          audioBuffer={analyzer.audioBuffer}
          setNeedle={setNeedle}
          needleSearch={needleSearch}
          time={analyzer.time} />
        <FrequencyMeter
          audioContext={analyzer.audioContext}
          audioSource={analyzer.audioSource} />
      </div>
    );
  }
}

export default Analyzer;
