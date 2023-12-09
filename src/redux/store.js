import {createStore, applyMiddleware, combineReducers} from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import authReducer from './authReducer';

const middleware = [thunk];

// export const store = createStore(authReducer, applyMiddleware(...middleware));

const store = configureStore({
  reducer: authReducer,
}, applyMiddleware(...middleware))
export default store