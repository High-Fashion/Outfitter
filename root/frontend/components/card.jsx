import React, { Component } from 'react';
import { Text, Pressable, Image, StyleSheet } from 'react-native'
import { VStack, Box, Divider, Center } from 'native-base';

export default class Card extends Component {

    render() {
        return (
                <Box display="flex" flexWrap="wrap" bgColor="light.100" borderStyle="solid" borderColor="coolGray.150" shadow="5" py="4" px="3" 
                 borderRadius="5" rounded="md" width="100%">
                    <VStack space="1" divider={<Divider />}>
                        <Center px="3" pt="3">
                            <Image source={this.props.image} />
                            <Text style={{adjustsFontSizeToFit:"true", width:"25%"}}>{this.props.itemType}</Text>
                        </Center>
                    </VStack>
                </Box>
        );
    }
}

// const cardStyle = StyleSheet.create({
//     card: {
//         // flex:1,
//         flexDirection: "column",
//         // elevation: 5,
//         width: "100%",
//         height: "30%",
//         alignItems: "center",
//         justifyContent: "center",
//         border:3,
//         margin:1:3,
//         borderColor:"black",
//         borderRadius: 5,
//         backgroundColor: "blue"

//     }
// })