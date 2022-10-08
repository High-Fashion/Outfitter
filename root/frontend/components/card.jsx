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
                            <Text style={{adjustsFontSizeToFit:"true"}}>{this.props.itemType}</Text>
                        </Center>
                    </VStack>
                </Box>
        );
    }
}