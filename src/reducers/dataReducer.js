import {FETCHING_DATA, FETCHING_DATA_SUCCESS, FETCHING_DATA_ERROR} from '../constants';

const initialState = {
    memories: [],
    isFetching: false,
    error: false,
    success: false
}

export default dataReducer = (state = initialState, action) => {
    switch(action.type){        
        case FETCHING_DATA:
            return {
                ...state,
                memories: [],
                error: false,
                isFetching: true,
                success: false
            }
        case FETCHING_DATA_SUCCESS: 
            return {
                ...state,
                memories: action.data,
                isFetching: false,
                error: false,
                success: true
            }
        case FETCHING_DATA_ERROR:
            return {
                ...state,
                memories: [],
                isFetching: false,
                error: true,
                success: false
            }
        default:
            return state
    }
}