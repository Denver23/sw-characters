export const getCharactersList = (state) => {
    return state.characterReducer.characters;
};

export const getCharactersCount = (state) => {
    return state.characterReducer.count;
};

export const getIsFetching = (state) => {
    return state.characterReducer.isFetching;
};
