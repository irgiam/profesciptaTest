import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderList from '../screens/OrderList';
import ItemList from '../screens/ItemList';
import Login from '../screens/Login';
import { MainRouteName } from '../constants/mainRouteName';

const NavigationProvider = () => {
    const Stack = createNativeStackNavigator();
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const loggedIn = useSelector(state => state.isLoggedIn);
    // const token = useSelector(state => state.token);

    useEffect(() => {
        setIsLoggedIn(loggedIn);
        console.log('is logged in ->', loggedIn);
    }, [loggedIn])

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName={
                    isLoggedIn == true ? MainRouteName.ORDER_LIST : MainRouteName.LOGIN
                    // MainRouteName.HOME
                }
            >
                <Stack.Screen name={MainRouteName.LOGIN} component={Login} options={{ headerShown: false }} />
                <Stack.Screen name={MainRouteName.ORDER_LIST} component={OrderList} options={{ headerShown: false }} />
                <Stack.Screen name={MainRouteName.ITEM_LIST} component={ItemList} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationProvider