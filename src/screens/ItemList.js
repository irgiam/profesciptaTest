import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { MainRouteName } from '../constants/mainRouteName';
import { LOGOUT } from '../constants/actionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import axiosInstance from '../helpers/axiosInstance';
import ItemListButton from './components/ItemListButton';
import Modal from 'react-native-modal';
import Currency from '../helpers/Currency';

const ItemList = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [itemName, setItemName] = useState();
    const [price, setPrice] = useState();
    const [itemQty, setItemQty] = useState(1);
    const [selectedItem, setSelectedItem] = useState()
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalProduct, setTotalProduct] = useState(0)
    const dispatch = useDispatch();

    const config = {
        headers: {
            'state': '12345'
        }
    }

    useEffect(() => {
        getItemList();
    }, [])

    const logout = () => {
        AsyncStorage.clear();
        dispatch({
            type: LOGOUT
        });
        navigation.push(MainRouteName.LOGIN);
    }

    const getItemList = () => {
        setLoading(true);
        axiosInstance
            .get('/Order/GetItems', config)
            .then(res => {
                // console.log("get item list->", res.data);
                setItemList(res.data);
                setTotalPrice(res.data.reduce((prev,next) => prev + (next.Price * next.Quantity),0))
                setTotalProduct(res.data.reduce((prev,next) => prev + next.Quantity,0))
            }).catch(error => {
                console.error('error get item: ', error.response.status);
                if (error.response.status === 401){
                    logout();
                }
            }).finally(() => setLoading(false));
    }

    const createItem = () => {
        axiosInstance
            .post('/Order/CreateItem',
                {
                    ItemId: -3,
                    OrderId: 0,
                    ItemName: itemName,
                    Quantity: itemQty,
                    Price: price
                },
                config
            )
            .then(res => {
                closeModalAdd();
                getItemList();
            })
            .catch(err => {
                console.log('error Add Item:', err);
            });
    }

    const editItem = () => {
        axiosInstance
            .post('/Order/UpdateItem',
                {
                    ItemId: selectedItem.ItemId,
                    OrderId: selectedItem.OrderId,
                    ItemName: itemName,
                    Quantity: itemQty,
                    Price: price
                },
                config
            )
            .then(res => {
                closeModalAdd();
                getItemList();
                setSelectedItem();
            })
            .catch(err => {
                console.log('error Add Item:', err);
                setSelectedItem();
            });
    }

    const deleteItem = () => {
        axiosInstance
            .post('/Order/DeleteItem',
                selectedItem,
                config
            )
            .then(res => {
                getItemList();
                closeDeleteModal();
            })
            .catch(err => {
                setSelectedItem();
                console.log('error Add Item:', err);
            });
    }

    const openEditModal = (item) => {
        // console.log(item);
        setSelectedItem(item);
        setItemName(item.ItemName);
        setItemQty(item.Quantity);
        setPrice(String(item.Price))
        setModalAddVisible(true);
    }

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setModalDeleteVisible(true);
    }

    const closeDeleteModal = () => {
        setSelectedItem();
        setModalDeleteVisible(false);
    }

    const closeModalAdd = () => {
        setItemQty(1);
        setItemName();
        setPrice();
        setModalAddVisible(false);
    }


    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={[styles.header, {backgroundColor: '#677800', width: '100%', marginLeft: 0}]}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold', marginVertical: 15, marginLeft: '2.5%'}}>Detail Sales </Text>
                </View>
                <View style={styles.header}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 15}}>Detail Sales </Text>
                    <TouchableOpacity onPress={() => setModalAddVisible(true)} style={[styles.greenButton, {width: '30%'}]}>
                        <Text style={{color: '#fff'}}>Add Item</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contentItem}>
                    {
                        itemList?.map((data, index) => {
                            return <ItemListButton data={data} key={index} deleteFunction={() => openDeleteModal(data)} editFunction={() => openEditModal(data)} />
                        })
                    }
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View style={[styles.header, { marginRight: '2.5%' }]}>
                    <Text>Order Summary </Text>
                </View>
                <View style={[styles.header, {marginRight: '2.5%'}]}>
                    <Text>Sub Total: </Text>
                    <Text>Rp {totalPrice} </Text>
                </View>
                <View style={[styles.header, {marginRight: '2.5%'}]}>
                    <Text>Total Product: </Text>
                    <Text style={{marginRight: '2.5%'}}>{totalProduct}</Text>
                </View>
                <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => navigation.push(MainRouteName.ORDER_LIST)} style={[styles.greenButton, {width: '45%'}]}>
                        <Text style={{ color: '#fff' }}>Process Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.whiteButton, {width: '45%'}]}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                backdropOpacity={(modalAddVisible) ? 0.7 : 0}
                visible={modalAddVisible}
                onRequestClose={() => {
                    setModalAddVisible(!modalAddVisible);
                }}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        paddingVertical: 16,
                        paddingHorizontal: 14,
                        maxHeight: '90%',
                        alignItems: 'center'
                    }}
                >
                    <View style={[styles.modalInput]}>
                        <Text>Item Name</Text>
                        <TextInput style={styles.inputText}
                            value={itemName}
                            onChangeText={(e) => setItemName(e)}
                        />
                    </View>
                    <View style={[styles.modalInput, { marginVertical: 20 }]}>
                        <Text>Price</Text>
                        <TextInput style={styles.inputText}
                            value={price}
                            onChangeText={(e) => setPrice(e)}
                        />
                    </View>
                    <View style={styles.header}>
                        <Text>Total: </Text>
                        <Text>Rp {(price) ? Currency(price * itemQty) : 0} </Text>
                    </View>
                    <View style={styles.header}>
                        <Text style={{marginTop: 22.5}}>QTY: </Text>
                        <View style={styles.itemCount}>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => (itemQty > 1) ? setItemQty(itemQty - 1) : setItemQty(itemQty)} >
                                <Icon name={'minus-circle'} size={34} style={{ color: '#394144' }} />
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: '10%', marginTop: 7 }}>{itemQty}</Text>
                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => setItemQty(itemQty + 1)} >
                                <Icon name={'plus-circle'} size={34} style={{ color: '#394144' }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => (selectedItem) ? editItem() : createItem()} style={[styles.greenButton, { width: '45%' }]}>
                            <Text style={{ color: '#fff' }}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => closeModalAdd()} style={[styles.whiteButton, { width: '45%' }]}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                backdropOpacity={(modalDeleteVisible) ? 0.7 : 0}
                visible={modalDeleteVisible}
                onRequestClose={() => {
                    setModalDeleteVisible(!modalDeleteVisible);
                }}>
                    <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        paddingVertical: 16,
                        paddingHorizontal: 14,
                        maxHeight: '90%',
                        alignItems: 'center'
                    }}
                >
                    <Text>Are you sure wants to delete this item </Text>
                    <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => deleteItem()} style={[styles.greenButton, { width: '45%' }]}>
                            <Text style={{ color: '#fff' }}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => closeDeleteModal()} style={[styles.whiteButton, { width: '45%' }]}>
                            <Text>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
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
    greenButton: {
        backgroundColor: '#677800',
        marginTop: 10,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    whiteButton: {
        backgroundColor: '#fff',
        borderColor: '#677800',
        borderWidth: 1,
        marginTop: 10,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footer: {
        // flexWrap: 'wrap',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 0.15
    },
    modalInput: {
        width: '90%',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    inputText: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'gray',
        backgroundColor: '#ffffff',
        height: 35
    },
    itemCount: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: 5,
        marginRight: '30%',
        marginTop: 10
    },
})

export default ItemList