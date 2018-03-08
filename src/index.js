import React, {Component} from 'react'

import { 
    StackNavigator, 
    addNavigationHelpers 
} from 'react-navigation'

import {
    createStore,
    applyMiddleware,
    combineReducers,
  } from 'redux';

import { 
    Provider, 
    connect 
} from 'react-redux'

import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
  } from 'react-navigation-redux-helpers';

import BugFreeStackNavigator from './lib/BugFreeStackNavigator'
import Routes from './config/routes'
import getStore from './store'

import { YellowBox } from 'react-native';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['FIREBASE WARNING']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};

const Navigator = BugFreeStackNavigator(Routes, {
    headerMode: 'screen',
    initialRouteName: 'Loading'
})

const navReducer = (state, action) => {
    const newState = Navigator.router.getStateForAction(action, state)
    return newState || state
}

const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
  );

const addListener = createReduxBoundAddListener("root");

class App extends Component {
    render(){
        return (
            <Navigator 
                navigation={addNavigationHelpers({
                    dispatch: this.props.dispatch,
                    state: this.props.nav,
                    addListener
                })}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav
  });

const store = getStore(navReducer,middleware);

const AppIndex = connect(mapStateToProps)(App)

export default Index = () => {
    return (
        <Provider store={store}>
            <AppIndex />
        </Provider>
    )
}