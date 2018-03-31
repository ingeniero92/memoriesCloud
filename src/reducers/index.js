import { combineReducers } from 'redux';
import memoriesReducer from './memoriesReducer'
import userReducer from './userReducer'

export default function getRootReducer(navReducer) {
    return combineReducers({
        nav: navReducer,
        memories: memoriesReducer,
        user: userReducer
    })
}