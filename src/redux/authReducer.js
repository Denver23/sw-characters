const SET_USER_DATA = 'SET_USER_DATA';

let initialState = {
    isAuth: false,
    email: '',
    id: '',
    name: '',
    picture: '',
    userID: ''
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

export const authReducersActions = {
    setAuthUserData: (data) => {return {type: SET_USER_DATA, payload: data}}
};

export const signIn = (response) => (dispatch) => {
    try {
        dispatch(authReducersActions.setAuthUserData({
            email: response.email,
            id: response.id,
            name: response.name,
            picture: response.picture.data.url,
            userID: response.userID,
            isAuth: true
        }));
        localStorage.setItem('userID', response.userID);
    } catch (err) {
        console.log(`${err.name}: ${err.message}`);
    }
};

export const signOut = () => (dispatch) => {
    try {
        dispatch(authReducersActions.setAuthUserData({
            email: '',
            id: '',
            name: '',
            picture: '',
            userID: '',
            isAuth: false
        }));

    } catch (err) {
        console.log(`${err.name}: ${err.message}`);
    } finally {
        localStorage.removeItem('userID');
    }
};

export default authReducer;
