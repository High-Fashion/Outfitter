import React, { Component } from 'react';
import { Text, Pressable, Image, StyleSheet } from 'react-native'
import { VStack, Box, Divider } from 'native-base';

export default class Card extends Component {

    render() {
        return (
            // <Text>The text works</Text>
            <Pressable style={cardStyle.container}>
                <Box border="1" borderRadius="md">
                    <VStack space="4" divider={<Divider />}>
                        <Box px="4" pt="4">
                            <Image source={this.props.image}/>
                            <Text>{this.props.itemType}</Text>
                        </Box>
                    </VStack>
                </Box>
            </Pressable>
        );
    }
}

const cardStyle = StyleSheet.create({
    container: {
        elevation: 5,
        borderRadius: 5,
        width: "30%",
        height: "40%",
        backgroundColor: "white"
    }
})