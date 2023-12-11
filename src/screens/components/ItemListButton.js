import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Currency from '../../helpers/Currency';

const ItemListButton = ({ data, deleteFunction, editFunction }) => {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={{alignItems: 'center'}}>
                    <Text>{data.ItemName}</Text>
                    <Text>Rp {Currency(data.Price)}</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <Text>QTY</Text>
                    <Text>{data.Quantity}</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <Text>Total</Text>
                    <Text>Rp {Currency(data.Price * data.Quantity)}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: '2.5%' }}>
                    <TouchableOpacity onPress={editFunction}>
                        <Icon
                            name="pencil"
                            color="black"
                            size={28}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteFunction} style={{ marginLeft: 7.5 }}>
                        <Icon
                            name="trash"
                            color="black"
                            size={28}
                        />
                    </TouchableOpacity>
                </View>
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
        marginTop: '1%',
        marginLeft: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})

export default ItemListButton