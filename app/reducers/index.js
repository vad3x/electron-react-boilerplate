import { combineReducers } from 'redux';
import counter from './counter';
import analyzer from './analyzer';

const rootReducer = combineReducers({
  counter,
  analyzer
});

export default rootReducer;
