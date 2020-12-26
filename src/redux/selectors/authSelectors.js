export const getAuthConfirm = (state) => {
    return state.authReducer.isAuth;
};

export const getUserName = (state) => {
    return state.authReducer.name;
};

export const getUserID = (state) => {
    return state.authReducer.id;
};

export const getUserEmail = (state) => {
    return state.authReducer.email;
};

export const getUserPicture = (state) => {
    return state.authReducer.picture;
};
