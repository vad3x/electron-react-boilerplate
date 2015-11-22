import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Analyzer from '../components/Analyzer';
import * as AnalyzerActions from '../actions/analyzer';

function mapStateToProps(state) {

  const remote = require('remote');

  return {
    dialog: remote.require('dialog'),
    currentWindow: remote.getCurrentWindow(),
    analyzer: state.analyzer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AnalyzerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Analyzer);
