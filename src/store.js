import {createStore, applyMiddleware} from 'redux'
import getRootReducer from './reducers'

export default function getStore(navReducer,middleware){
    return store = createStore(getRootReducer(navReducer),applyMiddleware(middleware))
}