import { createStore, combineReducers, applyMiddleware, compose } from 'redux'; //import redux from 'redux'; not working for ES6
import thunk from 'redux-thunk';

import { reducer as formReducer } from 'redux-form';
// import * as myReducers from 'reducers';

export var configure = (initialState = {}) =>{
  //Using axios and redux tgt

  var reducers = combineReducers({
    form: formReducer,
    // auth: authReducer
  })

  const middleware = [thunk];

  const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

  const enhancer = composeEnhancers(
    applyMiddleware(...middleware),
    // other store enhancers if any
  );
  const store = createStore(reducers, initialState, enhancer);

  return store;
}
