import React, {useState, useRef} from 'react';
import { AutoComplete } from 'antd';
import s from './CharacterAutocompleteComponent.module.scss';
import {charactersAPI} from "../../api/api";
import { useHistory } from 'react-router-dom';
import {getSWAPIId} from "../../utils/getSWAPIId";

const CharactersAutocompleteComponent = () => {

    const history = useHistory();

    const [searchData, setSearchData] = useState([]);
    const [options, setOptions] = useState([]);

    let latestQueryString = useRef('');


    const onSearch = (searchText) => {
        latestQueryString.current = searchText;

        if(searchText === '') {
            setSearchData([]);
            setOptions([]);
            return;
        }
        try{
            setTimeout(async () => {
                if(searchText === latestQueryString.current) {
                    let result = await charactersAPI.searchCharacters(searchText);

                    setSearchData(result.data.results);
                    const charactersList = result.data.results.map(character => ({value: character.name}));
                    setOptions(charactersList);
                }
            }, 500)

        } catch (err) {
            console.log(err);
        }
    };

    const onSelect = (data) => {
        const character = searchData.find(item => item.name === data);
        history.push(`/characters/${getSWAPIId(character.url)}`)
    };

    return <div className={s.wrapper}>
        <AutoComplete
            options={options}
            style={{
                width: 200,
            }}
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="Search Character"
        />
    </div>
};

export default CharactersAutocompleteComponent;
