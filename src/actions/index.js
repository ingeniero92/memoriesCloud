import {FETCHING_DATA, FETCHING_DATA_SUCCESS, FETCHING_DATA_ERROR} from '../constants/';
import FirebaseHelpers from '../api/firebaseHelpers'

export const getData = () => {
    return {
        type: FETCHING_DATA
    }
}

export const getDataSuccess = data => {
    return {
        type: FETCHING_DATA_SUCCESS,
        data
    }
}

export const getDataFailure = (err) => {
    return {
        type: FETCHING_DATA_ERROR,
        err
    }
}

export const fetchData = (user) => {
    return (dispatch) => {
        dispatch(getData())
        FirebaseHelpers.getMemories(user)
            .then(([response]) => {
                dispatch(getDataSuccess(response))
            })
            .catch((err) => dispatch(getDataFailure(err)))
    }
}