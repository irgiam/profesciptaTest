import React, { useState, useEffect } from 'react';
import { LOGOUT } from '../constants/actionTypes';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainRouteName } from '../constants/mainRouteName';
import { useDispatch } from 'react-redux';

const OrderList = ({navigation}) => {
    const [loading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const logout = () => {
        AsyncStorage.clear();
        dispatch({
            type: LOGOUT
        });
        navigation.push(MainRouteName.LOGIN);
    }

    return (
        <View>
            <TouchableOpacity
                onPress={() => logout()}
            >
                <Icon
                    name="log-out"
                    color="black"
                    size={24}
                />
            </TouchableOpacity>
            
            <Text>Order list</Text>
        </View>
    )
}

export default OrderList