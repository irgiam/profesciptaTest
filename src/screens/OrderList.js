import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LOGOUT } from '../constants/actionTypes';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainRouteName } from '../constants/mainRouteName';
import { useDispatch } from 'react-redux';
import axiosInstance from '../helpers/axiosInstance';
import OrderListButton from './components/OrderListButton';

const OrderList = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        getOrderList();
    }, [])


    const logout = () => {
        AsyncStorage.clear();
        dispatch({
            type: LOGOUT
        });
        navigation.push(MainRouteName.LOGIN);
    }

    const getOrderList = () => {
        setLoading(true);
        const config = {
            headers: {
                'state': '12345'
            }
        }
        axiosInstance
            .get('/Order/GetOrderList', config)
            .then(res => {
                // console.log("get order list->", res);
                setOrderList(res.data);
            }).catch(error => {
                console.error('error get order: ', error);
                if (error.response.status === 401){
                    logout();
                }
            }).finally(() => setLoading(false));
    }

    return (
        <ScrollView>
            <View style={[styles.header, { backgroundColor: '#677800', width: '100%', marginLeft: 0 }]}>
                <Icon
                    name="person-circle-outline"
                    color="#fff"
                    size={24}
                    style={{marginLeft: '2.5%', marginTop: 5}}
                />
                <TouchableOpacity
                    onPress={() => logout()}
                    style={{marginRight: '2.5%', marginTop: 5}}
                >
                    <Icon
                        name="log-out"
                        color="#fff"
                        size={24}
                    />
                </TouchableOpacity>
            </View>
            <View style={[styles.header, { backgroundColor: '#677800', width: '100%', marginLeft: 0 }]}>
                <Text style={{ fontSize: 28, color: '#fff', fontWeight: 'bold', marginVertical: 5, marginLeft: '2.5%' }}>Sales Order List </Text>
            </View>
            <View style={styles.header}>
                <Text>Order list</Text>
                <Text>Total Ttem: {orderList.length}</Text>
            </View>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.push(MainRouteName.ITEM_LIST)} style={styles.addButton}>
                    <Text style={{ color: '#fff' }}>Add</Text>
                </TouchableOpacity>
                
            </View>
            <View style={styles.contentItem}>
                {
                    orderList?.map((data, index) => {
                        return <OrderListButton data={data} key={index} />
                    })
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        marginLeft: '2.5%'
    },
    contentItem: {
        width: '97.5%',
        marginLeft: '2.5%',
        marginTop: 10
    },
    addButton: {
        backgroundColor: '#677800',
        width: '30%',
        marginTop: 10,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default OrderList