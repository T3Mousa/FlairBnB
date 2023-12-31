import { csrfFetch } from "./csrf";

const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

const removeUser = () => ({
    type: REMOVE_USER,
});

export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/current-session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password,
        }),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(setUser(data.user));
    } else {
        console.log(data)
        return data;
    }
};

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/current-session");

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user));
        // return response;
    }
};

export const signup = (userInfo) => async (dispatch) => {
    const { firstName, lastName, email, username, password } = userInfo;
    const response = await csrfFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            username,
            password
        })
    })
    const signUpInfo = await response.json();
    if (response.ok) {
        dispatch(setUser(signUpInfo.user))
    } else {
        console.log(signUpInfo)
        return signUpInfo
    }

}


export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/current-session', {
        method: 'DELETE'
    })
    if (response.ok) {
        dispatch(removeUser())
    }
}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case SET_USER:
            newState.user = action.payload;
            return newState;
        case REMOVE_USER:
            newState.user = null;
            return newState;
        default:
            return state;
    }
};

export default sessionReducer;
