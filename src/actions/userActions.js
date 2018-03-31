import {FETCHING_USER, FETCHING_USER_SUCCESS, FETCHING_USER_ERROR} from '../constants/';
import FirebaseHelpers from '../api/firebaseHelpers'

export const getUser = () => {
    return {
        type: FETCHING_USER
    }
}

export const getUserSuccess = data => {
    return {
        type: FETCHING_USER_SUCCESS,
        data
    }
}

export const getUserFailure = (error) => {
    return {
        type: FETCHING_USER_ERROR,
        error
    }
}

export const fetchUser = () => {
    return (dispatch) => {
        dispatch(getUser())
        try {
            let actualUser = FirebaseHelpers.getActualUser()            
            dispatch(getUserSuccess(actualUser))
        } catch(error){
            dispatch(getUserFailure(error))
        }        

    }
}