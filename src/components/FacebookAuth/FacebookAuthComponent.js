import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import FacebookLogin from "react-facebook-auth";
import {Button, Col, Row} from "antd";
import {FacebookOutlined, ImportOutlined} from '@ant-design/icons';
import {
    getAuthConfirm,
    getUserName
} from "../../redux/selectors/authSelectors";
import {signIn, signOut} from "../../redux/authReducer";
import s from './FacebookAuthComponent.module.scss';

const MyFacebookButton = ({onClick}) => (
    <div className={s.loginBlock}>
        <Button type="primary" shape="circle" icon={<FacebookOutlined/>} size={'default'} onClick={onClick}/>
    </div>
);

const LoginComponent = ({signOut}) => {

    const name = useSelector(getUserName);

    return <Row>
        <Col span={18} className={s.loginBlock}>Hello, {name}</Col>
        <Col span={6} className={s.loginBlock}>
            <Button type="primary" shape="circle" icon={<ImportOutlined/>} size={'default'} onClick={() => {
                signOut();
            }}/>
        </Col>
    </Row>
};

const FacebookAuthComponent = () => {

    const dispatch = useDispatch();

    const isLoggedIn = useSelector(getAuthConfirm);

    return <div>
        {isLoggedIn ? <LoginComponent signOut={() => {
                dispatch(signOut())
            }}/> :
            <FacebookLogin
                appId="239303660950064"
                autoLoad={localStorage.getItem('userID')}
                callback={(response) => {
                    dispatch(signIn(response))
                }}
                component={MyFacebookButton}
            />
        }
    </div>
};

export default FacebookAuthComponent;
