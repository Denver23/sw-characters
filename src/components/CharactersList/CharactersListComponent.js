import React, {useState, useEffect, useRef, useMemo} from "react";
import {getCharacters, getListCharacters} from "../../redux/charactersReducer";
import {useDispatch, useSelector} from "react-redux";
import {getCharactersCount, getCharactersList, getIsFetching} from "../../redux/selectors/charactersSelectors";
import {Button, Input, Space, Table} from "antd";
import { Link } from "react-router-dom";
import {DislikeOutlined, LikeOutlined, SearchOutlined} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import { useLocation, useHistory } from 'react-router-dom';
import s from './CharacterListComponent.module.scss';
import {getSWAPIId} from "../../utils/getSWAPIId";
import { Radio } from 'antd';
import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";

const CharacterListComponent = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    let InputRef = useRef(null);
    let clearFilterRef = useRef(null);
    const page = new URLSearchParams(location.search).get("page") || 1;
    const [searchText, setSearchText] = useState(new URLSearchParams(location.search).get('search') || '');
    const [listType, setListType] = useState('allCharacters');

    const charactersList = useSelector(getCharactersList);
    const charactersCount = useSelector(getCharactersCount);
    const isFetching = useSelector(getIsFetching);

    const [likedCharacters, setLikedCharacters] = useState(localStorage.getItem('likedCharacters') === null ? [] : JSON.parse(localStorage.getItem('likedCharacters')));
    const [dislikedCharacters, setDislikedCharacters] = useState(localStorage.getItem('dislikedCharacters') === null ? [] : JSON.parse(localStorage.getItem('dislikedCharacters')));

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
            clearFilterRef.current = clearFilters;
            return <div style={{padding: 8}}>
                <Input
                    ref={InputRef}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => {
                        listType === 'allCharacters' ? handleSearch(selectedKeys, confirm, dataIndex) : confirm()
                    }}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            listType === 'allCharacters' ? handleSearch(selectedKeys, confirm, dataIndex) : confirm()
                        }}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters, dataIndex)} size="small" style={{width: 90}}>
                        Reset
                    </Button>
                </Space>
            </div>
        },
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered || searchText !== '' ? '#1890ff' : undefined }}/>,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => {
                    let temp = InputRef.current;
                    if (temp !== null) {
                        temp.select();
                    }
                }, 100);
            }
        },
        render: (text, record, index) =>
            searchText !== '' ? (
                <Link to={`/peoples/${getSWAPIId(record.url)}`} className={s.characterLink}>
                    <Highlighter
                        highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                </Link>
            ) : (
                <Link to={`/peoples/${getSWAPIId(record.url)}`} className={s.characterLink}>
                    {text}
                </Link>
            ),
    });

    const handleLike = (id) => {
        let likedCharactersNew = [...likedCharacters];
        if (dislikedCharacters.includes(id)) {
            const dislikedCharactersNew = dislikedCharacters.filter(char => char !== id);
            localStorage.setItem('dislikedCharacters', JSON.stringify(dislikedCharactersNew));
            setDislikedCharacters(dislikedCharactersNew);
        }
        if (likedCharacters.includes(id)) {
            likedCharactersNew = likedCharacters.filter(character => character !== id);
        } else {
            likedCharactersNew.push(id);
        }
        localStorage.setItem('likedCharacters', JSON.stringify(likedCharactersNew));
        setLikedCharacters(likedCharactersNew);
    };

    const handleDislike = (id) => {
        let dislikedCharactersNew = [...dislikedCharacters];
        if (likedCharacters.includes(id)) {
            const likedCharactersNew = likedCharacters.filter(char => char !== id);
            localStorage.setItem('likedCharacters', JSON.stringify(likedCharactersNew));
            setLikedCharacters(likedCharactersNew);
        }
        if (dislikedCharacters.includes(id)) {
            dislikedCharactersNew = dislikedCharacters.filter(character => character !== id);
        } else {
            dislikedCharactersNew.push(id);
        }
        localStorage.setItem('dislikedCharacters', JSON.stringify(dislikedCharactersNew));
        setDislikedCharacters(dislikedCharactersNew);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'name',
            width: '20%'
        },
        {
            title: 'Home World',
            dataIndex: 'homeworld',
            key: 'homeworld',
            width: '20%',
            render: (data, record, index) => <Link
                to={`/planets/${data.id}`}>{data.name}</Link>
        },
        {
            title: 'Rating',
            dataIndex: 'url',
            key: 'url',
            width: '15%',
            render: (data, record, index) => {
                const id = getSWAPIId(data);
                let liked = null;

                if(likedCharacters.includes(id)) {
                    liked = true;
                } else if(dislikedCharacters.includes(id)) {
                    liked = false;
                }
                return <><Button type="primary" shape="round" icon={<LikeOutlined />} size={'default'} onClick={() => handleLike(id)} className={s.button}>
                        {liked ? <CheckOutlined /> : ''}
                    </Button>
                    <Button type="danger" shape="round" icon={<DislikeOutlined />} size={'default'} onClick={() => handleDislike(id)} className={s.button}>
                    {liked !== null && !liked ? <CheckOutlined /> : ''}
            </Button></>
            }
        }
    ];

    useEffect(() => {
        dispatch(getCharacters(page, searchText));
    }, [page, searchText]);

    const onPageChange = (newPage, pageSize) => {
        let currentPage = page !== null ? +page : 1;
        if (currentPage !== newPage) {
            history.push({search: `?page=${newPage}${searchText !== '' ? `&search=${searchText}` : ''}`});
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        history.push(`?page=${page}&search=${selectedKeys[0]}`);
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleReset = clearFilters => {
        history.push(`?page=1`);
        clearFilters();
        setSearchText('');
    };

    const filterCharacters = (type) => {
        switch(type) {
            case 'allCharacters':
                if(page === 1) {
                    dispatch(getCharacters(1));
                } else {
                    history.push('/peoples')
                }
                clearFilterRef.current();
                setListType('allCharacters');
                break;
            case 'likedCharacters':
                dispatch(getListCharacters('likedCharacters'));
                setListType('likedCharacters');
                break;
            case 'dislikedCharacters':
                dispatch(getListCharacters('dislikedCharacters'));
                setListType('dislikedCharacters');
                break;
            default:
                return;
        }
    };

    return <>
        <Radio.Group defaultValue="allCharacters" buttonStyle="solid" onChange={(e) => {filterCharacters(e.target.value)}}>
            <Radio.Button value="allCharacters">All Characters</Radio.Button>
            <Radio.Button value="likedCharacters">Only Liked</Radio.Button>
            <Radio.Button value="dislikedCharacters">Only Disliked</Radio.Button>
        </Radio.Group>
        <Table
            loading={isFetching}
            columns={columns}
            dataSource={charactersList}
            pagination={{
                position: ['bottomCenter'],
                current: listType === 'allCharacters' ? page !== null ? +page : 1 : undefined,
                defaultPageSize: 10,
                hideOnSinglePage: true,
                total: charactersCount,
                showSizeChanger: false,
                onChange: listType === 'allCharacters' ? onPageChange : undefined
            }}
            rowKey={'name'}
        />
    </>
};

export default CharacterListComponent;
