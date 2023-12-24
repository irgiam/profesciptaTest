import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { navigate } from '../navigations/RootNavigator';
import { MainRouteName } from '../constants/mainRouteName';
import { LOGOUT } from '../constants/actionTypes';
import { useDispatch } from 'react-redux';

const axiosInstance = axios.create({
  baseURL: 'https://dev.profescipta.co.id/so-api', //belum pakai env
});

// let token = await AsyncStorage.getItem('token');

axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response =>
    new Promise((resolve, reject) => {
      resolve(response);
    }),
  error => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
    if (error?.response?.status === 401) {
      AsyncStorage.clear();
      navigate(MainRouteName.LOGIN);
    }
    else if (error?.response?.status === 404) {
      // console.log("not found");
      // Promise.reject('error 404');
      // console.log(token);
      return;
    }
    else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  },
);

export default axiosInstance;
