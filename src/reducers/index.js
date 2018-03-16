import { combineReducers } from 'redux';
import dataReducer from './dataReducer'
import memoriesReducer from './memoriesReducer'

export default function getRootReducer(navReducer) {
    return combineReducers({
        nav: navReducer,
        data: dataReducer,
        memories: memoriesReducer
    })
}