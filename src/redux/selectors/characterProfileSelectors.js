export const getCharacterName = (store) => {
    return store.characterProfileReducer.name;
};

export const getFetching = (store) => {
    return store.characterProfileReducer.isFetching;
};

export const getBirthYear = (store) => {
    return store.characterProfileReducer.birth_year;
};

export const getCharacterEyeColor = (store) => {
    return store.characterProfileReducer.eye_color;
};

export const getCharacterFilms = (store) => {
    return store.characterProfileReducer.films;
};

export const getCharacterGender = (store) => {
    return store.characterProfileReducer.gender;
};

export const getCharacterHairColor = (store) => {
    return store.characterProfileReducer.hair_color;
};

export const getCharacterHeight = (store) => {
    return store.characterProfileReducer.height;
};

export const getCharacterHomeworld = (store) => {
    return store.characterProfileReducer.homeworld;
};

export const getCharacterMass = (store) => {
    return store.characterProfileReducer.mass;
};

export const getCharacterSkinColor = (store) => {
    return store.characterProfileReducer.skin_color;
};

export const getCharacterSpecies = (store) => {
    return store.characterProfileReducer.species;
};

export const getCharacterStarships = (store) => {
    return store.characterProfileReducer.starships;
};

export const getCharacterVehicles = (store) => {
    return store.characterProfileReducer.vehicles;
};

export const getCharacterLiked = (store) => {
    return store.characterProfileReducer.liked;
};

export const getCharacterPhoto = (state) => {
    return state.characterProfileReducer.photoLink;
};
