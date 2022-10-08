import React, { Component } from 'react';
import { Text, Pressable, Image, StyleSheet, View } from 'react-native'
import { VStack, HStack, Box, Divider, Center } from 'native-base';


export default class HorizontalCard extends Component {

    render() {
        return (
            <Box borderWidth="1" borderColor="coolgray.500"> 
              <HStack space="4">
                <Box px="4" pt="4" justifyContent="center" alignItems="center" >
                    <Image source={require("../assets/hanger.png")} />
                </Box>
                <Box px="4" justifyContent="center" alignItems="center">
                  <Text>{this.props.itemType}</Text>
                </Box>
              </HStack>
            </Box>
          );
    }
}