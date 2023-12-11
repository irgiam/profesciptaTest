import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import moment from 'moment';

const OrderListButton = ({ data }) => {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text>{data.OrderNo}</Text>
                <Text>{data.OrderNo}</Text>
                <Text>{moment(data.OrderDate).format('DD/MM/YYYY')}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '97.5%',
        padding: 4,
        height: 60,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    innerContainer: {
        width: '90%',
        marginTop: '5%',
        marginLeft: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})

export default OrderListButton