import React, { Component } from "react";
import {Button, Modal, StyleSheet, View, Text, FlatList, Pressable} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

import styles from './ItemModal.style.js';
import Card from "../components/card.jsx";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const DATA = require("./../assets/male-categories.json")

const modalStack = createNativeStackNavigator();

export default class ItemModal extends Component {
    state = {
        modalVisible: false
    };

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    render() {
        const { modalVisible } = this.state;
        return (
            

            <View style={styles.centeredView}>
             {/* <View> */}
                <Modal 
                    // style={{flex:1}}
                    propogateSwipe={true}
                    animationType="slide" 
                    transparent={true}
                    visible={modalVisible} 
                    onRequestClose={() => {
                        console.log("modal closed");
                        this.setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalView}>
                        <NavigationContainer independent="true">
                            <FlatList 
                                contentContainerStyle={{ paddingBottom: "60%"}}
                                columnWrapperStyle={{justifyContent: "space-evenly"}}
                                ItemSeparatorComponent={() => <View style={{height: "3%"}} />}
                                // backgroundColor="green"
                                style={{flex: 1}}
                                numColumns={2} 
                                data={Object.keys(DATA["mens"])}
                                renderItem = {({ item }) => (
                                    <Pressable onPress={() => {console.log(item + " pressed")}}>
                                        <Card itemType={item} image={require("./../assets/hanger.png")}/>
                                    </Pressable>
                                )}
                            />
                        </NavigationContainer>
                    </View>
                </Modal>
                <Button style={styles.centeredView}
                    title="Type of Item"
                    onPress={() => {
                    this.setModalVisible.bind(this)(!modalVisible)}
                    }
                />
            </View>
        );
    }
}

const listStyles = StyleSheet.create({
    item: {
        // marginHorizontal: 10,
        // marginTop: 24,
        backgroundColor: "white",
    },
    flatlist: {

    }
});