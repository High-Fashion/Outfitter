import React, { Component, useState } from "react";
import {Button, StyleSheet, View, Text,FlatList, Pressable} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

import { Box, Modal } from "native-base"

import styles from './ItemModal.style.js';
import Card from "../components/card.jsx";

// const DATA = require("../assets/male-categories.json")


function CategoryListScreen({ navigation }) {
    const[DATA, setData] = useState(require("../assets/male-categories.json"))
    return (
        <View>
            {/* <Text>Data</Text> */}
            <FlatList 
                contentContainerStyle={{ paddingBottom: "60%"}}
                columnWrapperStyle={{justifyContent: "space-evenly", width: "100%" }}
                ItemSeparatorComponent={() => <View style={{height: "2%"}} />}
                numColumns={2} 
                data={Object.keys(DATA["mens"])}
                renderItem = {({ item }) => (
                <Pressable onPress={() => navigation.navigate("ItemList", {items: DATA["mens"][item], name: item})}>
                <Card itemType={item} image={require("./../assets/hanger.png")}/>
                </Pressable>
                )}
            />
            <Button style={styles.centeredView}
                title="Category Type of Item"
                onPress={() => (
                    navigation.navigate("ItemList", {items: DATA["mens"][item]})
                    // console.log(Object.keys(DATA["mens"]))
                )}
            />
        </View>
    );
}

export default CategoryListScreen;

const listStyles = StyleSheet.create({
    item: {
        // marginHorizontal: 10,
        // marginTop: 24,
        backgroundColor: "white",
    },
    flatlist: {

    }
});