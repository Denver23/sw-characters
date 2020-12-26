import axios from "axios";

export const baseURL = 'https://swapi.dev/api/';

const instance = axios.create({
    baseURL
});

export const charactersAPI = {
    getCharactersList: (page, search) => {
        return instance.get(`people/`, {params: {page, search}});
    },
    searchCharacters: (search) => {
        return instance.get('people/', {params: {search}})
    },
    getCharacterProfile: (id) => {
        return instance.get(`/people/${id}`);
    }
};

export const planetsAPI = {
    getPlanet: (id) => {
        return instance.get(`planets/${id}`);
    }
};

export const directLinkAPI = {
    getData: (link) => {
        return axios.get(link.replace('http:', 'https:'));
    }
}
