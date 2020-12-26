import {charactersAPI } from "../api/api";
import {unique} from "../utils/uniqueElements";
import {getMultiData} from "../utils/getMultiRequestData";

const SET_CHARACTERS_LIST = 'SET_CHARACTERS_LIST';
const CHANGE_FETCHING = 'CHANGE_FETCHING';

let initialState = {
    isFetching: false,
    count: null,
    characters: []
};

const characterReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_CHARACTERS_LIST:
            return {...state, characters: action.data.characters, count: action.data.count};
        case CHANGE_FETCHING:
            return {...state, isFetching: action.value};
        default:
            return state;
    }
};

export const characterReducerActions = {
    setCharactes: (characters, count) => ({type: SET_CHARACTERS_LIST, data: {characters, count}}),
    changeFetching: (value) => ({type: CHANGE_FETCHING, value})
};

export const getCharacters = (page, search) => async (dispatch) => {
    try {
        dispatch(characterReducerActions.changeFetching(true));
        const result = await charactersAPI.getCharactersList(page, search);

        if (result) {
            let characters = result.data.results;
            if(result.data.results.length > 0) {

                const planets = unique(result.data.results.map(item => item.homeworld));

                const planetsData = await getMultiData(planets);
                characters = characters.map(character => {
                    let charactersPlanet = planetsData.find(planet => planet.url === character.homeworld);
                    return {...character, homeworld: {url: charactersPlanet.url, name: charactersPlanet.name, id: charactersPlanet.url.split('/')[5]}}
                })
            }
            dispatch(characterReducerActions.setCharactes(characters, result.data.count));
        }
    } catch(e) {
        console.log(e.message);
    } finally {
        dispatch(characterReducerActions.changeFetching(false));
    }
};

export const getListCharacters = (type) => async (dispatch) => {
    try {
        let charactersList = localStorage.getItem(type);
        if(charactersList !== null) {
            if(JSON.parse(charactersList).length > 0) {
                let linkList = JSON.parse(charactersList).map(id => `https://swapi.dev/api/people/${id}`);
                let result =  await getMultiData(linkList);

                const planets = unique(result.map(item => item.homeworld));

                const planetsData = await getMultiData(planets);
                result = result.map(character => {
                    let charactersPlanet = planetsData.find(planet => planet.url === character.homeworld);
                    return {...character, homeworld: {url: charactersPlanet.url, name: charactersPlanet.name, id: charactersPlanet.url.split('/')[5]}}
                });

                dispatch(characterReducerActions.setCharactes(result, 0))
            } else {
                dispatch(characterReducerActions.setCharactes([], 0))
            }
        }
    } catch (e) {
        console.log(e);
    }
};

export default characterReducer;
