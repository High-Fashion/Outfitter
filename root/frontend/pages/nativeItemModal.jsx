import React, { Component } from "react";
import {Button, StyleSheet, View, Text,FlatList, Pressable} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

import { Box, Modal } from "native-base"

import styles from './ItemModal.style.js';
import Card from "../components/card.jsx";

const DATA = require("../assets/male-categories.json")

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
            // <View style={styles.centeredView}>
            <Box>
                <Modal> 
                        <Modal.Header>Categories</Modal.Header>
                        <Modal.CloseButton/>
                        <Modal.Body>
                            <Box>
                            <FlatList backgroundColor="green"
                                    style={{flex: 1}}
                                    numColumns={2} 
                                    data={Object.keys(DATA["mens"])}
                                    renderItem = {({ item }) => (
                                        <Pressable onPress={() => {console.log(item + " pressed")}}>
                                            <Card itemType={item} image={require("./../assets/hanger.png")}/>
                                        </Pressable>
                                    )}
                            />
                            </Box>
                        </Modal.Body>
                </Modal>
                <Button style={styles.centeredView}
                    title="Type of Item"
                    onPress={() => {
                    this.setModalVisible.bind(this)(!modalVisible)}
                    }
                />
            </Box>
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