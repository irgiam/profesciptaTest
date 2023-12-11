import {applyMiddleware} from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import authReducer from './authReducer';

const middleware = [thunk];

const store = configureStore({
  reducer: authReducer,
}, applyMiddleware(...middleware))
export default store