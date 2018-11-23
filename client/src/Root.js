import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './store/reducers';

const composeEnhancers =
  (process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;

const Root = ({ children, initialState = {} }) => {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );
  return <Provider store={store}>{children}</Provider>;
};

export default Root;
