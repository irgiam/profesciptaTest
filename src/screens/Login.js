import React, { useState, useEffect } from 'react';
import { LOGIN_SUCCESS } from '../constants/actionTypes';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { MainRouteName } from '../constants/mainRouteName';
import axiosInstance from '../helpers/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';

const Login = ({ navigation }) => {
    const [clientId, setClientId] = useState();
    const [password, setPassword] = useState();
    const [loading, setIsLoading] = useState(false);
    const [eyeIcon, setEyeIcon] = useState(false);
    const credential = 'client_credentials';
    const dispatch = useDispatch();

    const checkLogin = async () => {
        let token = await AsyncStorage.getItem('token');
        if (!token) {
            // navigation.navigate(MainRouteName.LOGIN);
            return;
        } else {
            console.log("token->", token)
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { token: token },
            });
            navigation.navigate(MainRouteName.ORDER_LIST);
        }

    }

    useEffect(() => {
        checkLogin();
    }, []);

    const login = async (data, url) => {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        return axiosInstance
            .post(url, data, config)
            .then(res => {
                // console.log('login res->',res.data);
                // return;
                AsyncStorage.setItem('token', res.data.access_token);
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: { token: res.data.access_token },
                });
                navigation.navigate(MainRouteName.ORDER_LIST);
                Promise.resolve();
                return Promise.resolve(res);
            })
            .catch(err => {
                console.log('errorLogin', err);

                Promise.reject();
                return Promise.reject(err);
            });
    };

    const onLoginPress = () => {
        login({
            grant_type: credential,
            client_id: clientId,
            client_secret: password
        }, '/token')
    }

    return (
        <View style={styles.container}>
            <View style={[styles.item, { marginTop: '50%' }]}>
                <TextInput style={styles.input}
                    value={clientId}
                    placeholder='Masukan Client Id'
                    onChangeText={(e) => setClientId(e)}
                />
            </View>
            <View style={[styles.item, { marginTop: 20 }]}>
                <TextInput style={styles.input}
                    value={password}
                    placeholder='Masukan Password'
                    onChangeText={(e) => setPassword(e)}
                    secureTextEntry={!eyeIcon}
                />
            </View>
            <TouchableOpacity onPress={() => onLoginPress()} style={styles.button}>
                <Text style={{ color: '#ffffff' }}>Masuk</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    item: {
        width: '90%',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'gray',
        backgroundColor: '#ffffff'
    },
    image: {
        width: 60,
        height: 60,
    },
    button: {
        backgroundColor: '#677800',
        width: '90%',
        marginTop: 20,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Login