import React, { useMemo } from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import FacebookAuthComponent from "./components/FacebookAuth/FacebookAuthComponent";
import {Col, Layout, Menu, Row} from "antd";
import CharacterListComponent from "./components/CharactersList/CharactersListComponent";
import {Route, Switch, Link} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import CharactersAutocompleteComponent from "./components/CharactersAutocomplete/CharactersAutocompleteComponent";
import CharacterProfileComponent from "./components/CharacterProfile/CharacterProfileComponent";
import Footer from "./components/Footer/FooterComponent";

const { Header, Content } = Layout;


const App = () => {

    const router = useLocation();

    const selectedItems = useMemo(() => {
        let resultArray;
        switch(router.pathname) {
            case '/':
                resultArray = ['Peoples'];
                break;
            case '/planets':
                resultArray = ['Planets'];
                break;
            case '/starships':
                resultArray = ['Starships'];
                break;
            case '/films':
                resultArray = ['Films'];
                break;
            case '/vehicles':
                resultArray = ['Vehicles'];
                break;
            case '/species':
                resultArray = ['Species'];
                break;
            case '/peoples':
                resultArray = ['Peoples'];
                break;
            default:
                return;
        }
        return resultArray;
    }, [router.pathname]);

    return <Layout className={'appGrid'}>
        <Layout style={{flexGrow: '0'}}>
            <Header className="header">
                <Row className={'header-row'}>
                    <Col span={12}>
                        <Menu theme="dark" mode="horizontal" selectedKeys={selectedItems}>
                            <Menu.Item key="Peoples"><Link to={'/peoples'}>Peoples</Link></Menu.Item>
                            <Menu.Item key="Planets"><Link to={'/planets'}>Planets</Link></Menu.Item>
                            <Menu.Item key="Starships"><Link to={'/starships'}>Starships</Link></Menu.Item>
                            <Menu.Item key="Films"><Link to={'/films'}>Films</Link></Menu.Item>
                            <Menu.Item key="Vehicles"><Link to={'/vehicles'}>Vehicles</Link></Menu.Item>
                            <Menu.Item key="Species"><Link to={'/species'}>Species</Link></Menu.Item>
                        </Menu>
                    </Col>
                    <Col cpan={5} offset={2}><CharactersAutocompleteComponent/></Col>
                    <Col span={5}><FacebookAuthComponent/></Col>
                </Row>
            </Header>
        </Layout>
        <Layout className={'contentWrapper'}>
            <Content className={'content'}>
                <Switch>
                    <Route exact path='/' component={CharacterListComponent}/>
                    <Route exact path='/peoples' component={CharacterListComponent}/>
                    <Route path='/peoples/:id' component={CharacterProfileComponent}/>
                    <Route exact path='/planets' component={CharacterListComponent}/>
                    <Route exact path='/starships' component={CharacterListComponent}/>
                    <Route exact path='/films' component={CharacterListComponent}/>
                    <Route exact path='/vehicles' component={CharacterListComponent}/>
                    <Route exact path='/species' component={CharacterListComponent}/>
                </Switch>
            </Content>
        </Layout>
        <Layout style={{flexGrow: '0'}}>
            <Footer/>
        </Layout>
    </Layout>
};

export default App;
