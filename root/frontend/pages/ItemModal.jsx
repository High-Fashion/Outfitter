import React, { Component } from "react";
import {Alert, Button, Modal, StyleSheet, View, Text, Pressable} from 'react-native';
import styles from './ItemModal.style.js';

import Card from "../components/card.jsx";

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
                <Modal
                    animationType="slide" 
                    transparent={true}
                    visible={modalVisible} 
                    onRequestClose={() => {
                        console.log("modal closed");
                        this.setModalVisible(!modalVisible);
                    }}
                >
                    {/*View for Modal*/}
                    <View style={styles.modalView}>
                        <Card itemType="Watch" image={require("./../assets/hanger.png")}/>
                    </View>
                </Modal>
                <Button style={styles.centeredView}
                    title="Type of Item"
                    onPress={() => 
                    this.setModalVisible.bind(this)(!modalVisible)}
                />
            </View>
        );
    }
}
