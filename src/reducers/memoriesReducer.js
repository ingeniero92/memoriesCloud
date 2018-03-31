import {FETCHING_MEMORIES, FETCHING_MEMORIES_SUCCESS, FETCHING_MEMORIES_ERROR} from '../constants';

const initialState = {
    memories: [],
    isFetching: false,
    error: false,
    success: false
}

export default memoriesReducer = (state = initialState, action) => {
    switch(action.type){        
        case FETCHING_MEMORIES:
            return {
                ...state,
                memories: [],
                error: false,
                isFetching: true,
                success: false
            }
        case FETCHING_MEMORIES_SUCCESS: 
            return {
                ...state,
                memories: action.data,
                isFetching: false,
                error: false,
                success: true
            }
        case FETCHING_MEMORIES_ERROR:
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