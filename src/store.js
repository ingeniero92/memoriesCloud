import {createStore, applyMiddleware, compose} from 'redux'
import getRootReducer from './reducers'
import thunk from 'redux-thunk';

export default function getStore(navReducer,middleware){
    return store = createStore(getRootReducer(navReducer),applyMiddleware(thunk))
}