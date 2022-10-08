import React, { Component, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import ItemModal from "./ItemModal.jsx"
import HorizontalCard from '../components/horizontalCard.jsx';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import styles from './ItemModal.style.js';
import ItemModalScreen from './ItemModal.jsx';
import CategoryListScreen from "./CategoryListScreen.jsx";

const modalStack = createNativeStackNavigator();
  
function NewItemScreen({ navigation }) {
    return (
      <View> 
        <Button style={styles.centeredView}
          title="Type of Item"
          onPress={() => {
            navigation.navigate("CategoryList")
          }}
        />
      </View>
    );
  }

export default NewItemScreen;