import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {characterProfileReducerActions, getCharacterProfile} from "../../redux/characterProfileReducer";
import {useDispatch, useSelector} from "react-redux";
import {
    getBirthYear,
    getCharacterCreated,
    getCharacterEdited,
    getCharacterEyeColor,
    getCharacterFilms,
    getCharacterGender,
    getCharacterHairColor, getCharacterHeight, getCharacterHomeworld, getCharacterLiked, getCharacterMass,
    getCharacterName, getCharacterSkinColor, getCharacterSpecies, getCharacterStarships, getCharacterVehicles,
    getFetching, getCharacterPhoto
} from "../../redux/selectors/characterProfileSelectors";
import {Breadcrumb, Button, Descriptions, Image, Input, Modal} from "antd";
import s from './CharacterProfileComponent.module.scss';
import {getSWAPIId} from "../../utils/getSWAPIId";
import SpinnerComponent from "../Spinner/SpinnerComponent";
import RatingComponent from "../Rating/RatingComponent";

const CharacterProfileComponent = () => {

    const dispatch = useDispatch();

    const params = useParams();
    const id = +params.id;

    const name = useSelector(getCharacterName);
    const characterBirthYear = useSelector(getBirthYear);
    const characterCreated = useSelector(getCharacterCreated);
    const characterEdited = useSelector(getCharacterEdited);
    const characterEyeColor = useSelector(getCharacterEyeColor);
    const characterFilms = useSelector(getCharacterFilms);
    const characterGender = useSelector(getCharacterGender);
    const characterHairColor = useSelector(getCharacterHairColor);
    const characterHeight = useSelector(getCharacterHeight);
    const characterHomeworld = useSelector(getCharacterHomeworld);
    const characterMass = useSelector(getCharacterMass);
    const characterSkinColor = useSelector(getCharacterSkinColor);
    const characterSpecies = useSelector(getCharacterSpecies);
    const characterStarships = useSelector(getCharacterStarships);
    const characterVehicles = useSelector(getCharacterVehicles);
    const characterPhoto = useSelector(getCharacterPhoto);

    let liked = useSelector(getCharacterLiked);

    const loading = useSelector(getFetching);

    const [isPhotoModalVisible, setPhotoModal] = useState(false);
    const [tempPhotoURL, setTempPhotoURL] = useState(characterPhoto);

    useEffect(() => {
        dispatch(getCharacterProfile(id));
    }, [id]);

    useEffect(() => {
        return () => {
            dispatch(characterProfileReducerActions.setCharacterProfile({
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
                liked: null
            }))
        }
    }, []);

    const handleLike = () => {
        let likedCharacters = [];
        if (liked === false) {
            const dislikedCharacters = JSON.parse(localStorage.getItem('dislikedCharacters')).filter(char => char !== id);
            localStorage.setItem('dislikedCharacters', JSON.stringify(dislikedCharacters));
        }
        if (localStorage.getItem('likedCharacters') !== null) {
            likedCharacters = JSON.parse(localStorage.getItem('likedCharacters'))
        }
        if (likedCharacters.length > 0 && likedCharacters.includes(id)) {
            likedCharacters = likedCharacters.filter(character => character !== id);
            dispatch(characterProfileReducerActions.setLiked(null))
        } else if (likedCharacters.length > 0 && !likedCharacters.includes(id)) {
            likedCharacters.push(id);
            dispatch(characterProfileReducerActions.setLiked(true));
        } else {
            likedCharacters = [id];
            dispatch(characterProfileReducerActions.setLiked(true));
        }
        localStorage.setItem('likedCharacters', JSON.stringify(likedCharacters));
    };

    const handleDislike = () => {
        let dislikedCharacters = [];
        if (liked === true) {
            const likedCharacters = JSON.parse(localStorage.getItem('likedCharacters')).filter(char => char !== id);
            localStorage.setItem('likedCharacters', JSON.stringify(likedCharacters));
        }
        if (localStorage.getItem('dislikedCharacters') !== null) {
            dislikedCharacters = JSON.parse(localStorage.getItem('dislikedCharacters'))
        }
        if (dislikedCharacters.length > 0 && dislikedCharacters.includes(id)) {
            dislikedCharacters = dislikedCharacters.filter(character => character !== id);
            dispatch(characterProfileReducerActions.setLiked(null))
        } else if (dislikedCharacters.length > 0 && !dislikedCharacters.includes(id)) {
            dislikedCharacters.push(id);
            dispatch(characterProfileReducerActions.setLiked(false));
        } else {
            dislikedCharacters = [id];
            dispatch(characterProfileReducerActions.setLiked(false));
        }
        localStorage.setItem('dislikedCharacters', JSON.stringify(dislikedCharacters));
    };

    const handleChangePhotoURL = () => {
        let charactersPhoto = localStorage.getItem('charactersPhoto') ? JSON.parse(localStorage.getItem('charactersPhoto')) : {};
        if (tempPhotoURL !== '') {
            charactersPhoto[id] = tempPhotoURL;
            localStorage.setItem('charactersPhoto', JSON.stringify(charactersPhoto));
            dispatch(characterProfileReducerActions.setPhotoLink(tempPhotoURL));
        } else {
            delete charactersPhoto[id];
            localStorage.setItem('charactersPhoto', JSON.stringify(charactersPhoto));
            dispatch(characterProfileReducerActions.setPhotoLink(''));
        }

        setPhotoModal(false)
    };

    const handleCancelPhotoURL = () => {
        setTempPhotoURL(characterPhoto);
        setPhotoModal(false)
    };

    return loading ? <SpinnerComponent/> : <>
        <Breadcrumb>
            <Breadcrumb.Item>
                <Link to={'/'}>Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={'/peoples'}>Peoples</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{name}</Breadcrumb.Item>
        </Breadcrumb>
        <div className={s.photoBlock}>
            <RatingComponent like={handleLike} dislike={handleDislike} liked={liked}/>
            <Image
                width={200}
                height={200}
                placeholder={true}
                src={characterPhoto}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
            />
            <div style={{textAlign: 'center', marginTop: '10px'}}>
                <Button type="dashed" size={'default'} shape={'round'} onClick={() => setPhotoModal(true)}>
                    (Change Photo)
                </Button>
            </div>
            <Modal title="Photo Link" visible={isPhotoModalVisible} onOk={handleChangePhotoURL} onCancel={handleCancelPhotoURL}>
                <Input defaultValue={characterPhoto} onChange={(e) => {
                    setTempPhotoURL(e.target.value)
                }}/>
            </Modal>
        </div>
        <Descriptions title="Character Info" bordered>
            <Descriptions.Item label="Name">{name}</Descriptions.Item>
            <Descriptions.Item label="Character Birth Year">{characterBirthYear}</Descriptions.Item>
            <Descriptions.Item label="Character Created">{characterCreated}</Descriptions.Item>
            <Descriptions.Item label="Character Edited">{characterEdited}</Descriptions.Item>
            <Descriptions.Item label="Character Eye Color">{characterEyeColor}</Descriptions.Item>
            <Descriptions.Item label="Character Mass">{characterMass} kg</Descriptions.Item>
            <Descriptions.Item label="Character Films" span={3}>
                <ul className={s.profileList}>
                    {characterFilms.map(film => {
                        return <li key={film.title}><Link to={`/film/${film.episode_id}`}>{film.title}</Link></li>
                    })}
                </ul>
            </Descriptions.Item>
            <Descriptions.Item label="Character Gender">{characterGender}</Descriptions.Item>
            <Descriptions.Item label="Character Hair Color">{characterHairColor}</Descriptions.Item>
            <Descriptions.Item label="Character Height">{characterHeight} cm</Descriptions.Item>
            <Descriptions.Item label="Character Homeworld">
                <Link
                    to={`/planets/${characterHomeworld.url !== undefined ? getSWAPIId(characterHomeworld.url) : ''}`}>
                    {characterHomeworld.name}
                </Link>
            </Descriptions.Item>
            <Descriptions.Item label="Character Skin Color">{characterSkinColor}</Descriptions.Item>
            <Descriptions.Item
                label="Character Starships">
                {characterStarships.length > 0 ?
                    <ul className={s.profileList}>
                        {characterStarships.map(starship => <li key={starship.name}><Link
                            to={`/starships/${getSWAPIId(starship.url)}`}>{starship.name}</Link></li>)}
                    </ul> :
                    'None'}
            </Descriptions.Item>
            <Descriptions.Item
                label="Character Vehicles">
                {characterVehicles.length > 0 ?
                    <ul className={s.profileList}>
                        {characterVehicles.map(vehicle => <li key={vehicle.name}><Link
                            to={`/vehicles/${getSWAPIId(vehicle.url)}`}>{vehicle.name}</Link></li>)}
                    </ul> :
                    'None'}
            </Descriptions.Item>
            {characterSpecies.length > 0 ?
                <Descriptions.Item label="Character Species">
                    {characterSpecies.map(specie => {
                        return <ul className={s.profileList}>
                            <li key={specie.name}>Name: {specie.name}</li>
                            <li key={specie.classification}>Classification: {specie.classification}</li>
                            <li key={specie.designation}>Designation: {specie.designation}</li>
                        </ul>
                    })}
                </Descriptions.Item> : ''}
        </Descriptions>
    </>
};

export default CharacterProfileComponent;
