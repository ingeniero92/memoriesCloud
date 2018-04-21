import {FETCHING_USER, FETCHING_USER_SUCCESS, FETCHING_USER_ERROR} from '../constants'

const initialState = {
    user: '',
    isFetching: false,
    error: false,
    success: false
}

export default userReducer = (state = initialState, action) => {
    switch(action.type){        
        case FETCHING_USER:
            return {
                ...state,
                user: '',
                error: false,
                isFetching: true,
                success: false
            }
        case FETCHING_USER_SUCCESS: 
            return {
                ...state,
                user: action.data,
                isFetching: false,
                error: false,
                success: true
            }
        case FETCHING_USER_ERROR:
            return {
                ...state,
                user: '',
                isFetching: false,
                error: true,
                success: false
            }
        default:
            return state
    }
}