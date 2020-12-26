import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware from 'redux-thunk';
import authReducer from "./authReducer";
import characterReducer from "./charactersReducer";
import characterProfileReducer from "./characterProfileReducer";

let rootReducer = combineReducers({
    authReducer,
    characterReducer,
    characterProfileReducer
});

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store;
