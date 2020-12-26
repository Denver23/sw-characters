import {charactersAPI} from "../api/api";
import {getMultiData} from "../utils/getMultiRequestData";

const SET_CHARACTER_PROFILE = 'SET_CHARACTER_PROFILE';
const SET_PROFILE_FETCHING = 'SET_PROFILE_FETCHING';
const SET_LIKED = 'SET_LIKED';
const SET_CHARACTER_PHOTO_LINK = 'SET_CHARACTER_PHOTO_LINK';

let initialState = {
    isFetching: false,
    birth_year: '',
    created: '',
    edited: '',
    eye_color: '',
    films: [],
    gender: '',
    hair_color: '',
    height: '',
    homeworld: '',
    mass: '',
    name: '',
    skin_color: '',
    species: [],
    starships: [],
    url: '',
    vehicles: [],
    liked: null,
    photoLink: ''
};

const characterProfileReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_CHARACTER_PROFILE:
            return {...state, ...action.data};
        case SET_PROFILE_FETCHING:
            return {...state, isFetching: action.value};
        case SET_LIKED:
            return {...state, liked: action.value};
        case SET_CHARACTER_PHOTO_LINK:
            return {...state, photoLink: action.value};
        default:
            return {...state}
    }
};

export const characterProfileReducerActions = {
    setCharacterProfile: (data) => ({type: SET_CHARACTER_PROFILE, data}),
    setFetching: (value) => ({type: SET_PROFILE_FETCHING, value}),
    setLiked: (value) => ({type: SET_LIKED, value}),
    setPhotoLink: (value) => ({type: SET_CHARACTER_PHOTO_LINK, value})
};

export const getCharacterProfile = (id) => async (dispatch) => {
    try {
        dispatch(characterProfileReducerActions.setFetching(true));
        const result = await charactersAPI.getCharacterProfile(id);
        let films = await getMultiData(result.data.films);
        let homeworld = await getMultiData([result.data.homeworld]);
        let starships = [];
        if(result.data.starships.length > 0) {
            starships = await getMultiData(result.data.starships);
        }
        let vehicles = [];
        if(result.data.vehicles.length > 0) {
            vehicles = await getMultiData(result.data.vehicles);
        }
        let species = [];
        if(result.data.species.length > 0) {
            species = await getMultiData(result.data.species);
        }

        let likedCharacters = localStorage.getItem('likedCharacters');
        let dislikedCharacters = localStorage.getItem('dislikedCharacters');
        let liked = null;

        if(likedCharacters !== null && JSON.parse(likedCharacters).includes(id)) {
            liked = true;
        } else if(dislikedCharacters !== null && JSON.parse(dislikedCharacters).includes(id)) {
            liked = false;
        }

        let charactersPhoto = localStorage.getItem('charactersPhoto');
        let photoLink = '';

        if(charactersPhoto && JSON.parse(charactersPhoto)[id]) {
            photoLink = JSON.parse(charactersPhoto)[id];
        }

        dispatch(characterProfileReducerActions.setCharacterProfile({...result.data, films, homeworld: homeworld[0], starships, vehicles, species, liked, photoLink}))
    } catch (err) {
        console.log(err);
    } finally {
        dispatch(characterProfileReducerActions.setFetching(false));
    }
};

export default characterProfileReducer;
