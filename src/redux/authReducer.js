import {
    CLEAR_AUTH_STATE,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
  } from '../constants/actionTypes/index';
  
  export default authReducer = (state = {
    isLoggedIn: false,
    token: null,
    error: '',
  }, action) => {
    const {type, payload} = action;
    switch (type) {
      case LOGIN_SUCCESS:
        return {
          ...state,
          isLoggedIn: true,
          token: payload.token,
        };
      case LOGIN_FAIL:
        return {
          ...state,
          isLoggedIn: false,
          error: payload.message,
        };
      case LOGOUT:
        return {
          ...state,
          isLoggedIn: false,
          token: null,
        };
      case CLEAR_AUTH_STATE:
        return {
          ...state,
          isLoggedIn: false,
          token: null,
        };
      default:
        return state;
    }
  };
  