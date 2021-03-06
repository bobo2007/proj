/**
 * File Name: src/store.js
 * Created By: bobo2007
 * Creation Date: 2017-04-19 17:25:39
 * Last Modified: 2017-04-19 17:25:39
 * Purpose:
 */


import {
  createStore
} from 'redux';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {
  count: 0
};

const store = createStore((state = initialState, action) => {
  // TODO: Add action handlers (aka "reducers")
  switch (action.type) {
    case 'COUNT':
      return { ...state,
        count: (state.count) + 1
      };
    default:
      return state;
  }
});

export default store;
