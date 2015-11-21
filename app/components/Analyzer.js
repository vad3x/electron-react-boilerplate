import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './Counter.module.css';

class Analyzer extends Component {
  static propTypes = {
    selectFile: PropTypes.func.isRequired
  }

  render() {
    const { selectFile, filePath, dialog, currentWindow } = this.props;

    return (
      <div>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`}>
          {filePath}
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={() => selectFile(dialog, currentWindow)}>selectFile</button>
        </div>
      </div>
    );
  }
}

export default Analyzer;
