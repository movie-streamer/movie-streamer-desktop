/* @flow */

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import thunk from 'redux-thunk';
import type { Store } from 'redux';

import reducers from './reducers';
import BrowserScreen from './components/BrowserScreen';
import MovieInfoScreen from './components/MovieInfoScreen';
import MovieScreen from './components/MovieScreen';
import type { Action } from './actions/types';

const initialState = {};

class App extends React.Component<{}> {
  store: Store<Object, Action>;

  constructor() {
    super();

    this.store = createStore(
      reducers,
      initialState,
      applyMiddleware(thunk),
    );
  }

  render() {
    return (
      <Provider store={this.store}>
        <BrowserRouter>
          <div>
            <Link to="/">Home</Link>
            <Switch>
              <Route exact path="/" component={BrowserScreen} />
              <Route exact path="/movieInfo" component={MovieInfoScreen} />
              <Route exact path="/movie" component={MovieScreen} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
