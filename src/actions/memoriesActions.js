import {FETCHING_MEMORIES, FETCHING_MEMORIES_SUCCESS, FETCHING_MEMORIES_ERROR} from '../constants/';
import FirebaseHelpers from '../api/firebaseHelpers'

export const getMemories = () => {
    return {
        type: FETCHING_MEMORIES
    }
}

export const getMemoriesSuccess = data => {
    return {
        type: FETCHING_MEMORIES_SUCCESS,
        data
    }
}

export const getMemoriesFailure = (err) => {
    return {
        type: FETCHING_MEMORIES_ERROR,
        err
    }
}

export const fetchMemories = (user) => {
    return (dispatch) => {
        dispatch(getMemories())
        FirebaseHelpers.getMemories(user)
            .then(([response]) => {
                dispatch(getMemoriesSuccess(response))
            })
            .catch((err) => dispatch(getMemoriesFailure(err)))
    }
}