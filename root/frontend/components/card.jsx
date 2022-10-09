import React, { Component } from 'react';
import { Text, Image, VStack, Box, Divider, Center } from 'native-base';

export default class Card extends Component {

    render() {
        return (
                <Box display="flex" flexWrap="wrap" bgColor="light.100" borderStyle="solid" borderColor="coolGray.150" shadow="5" py="4" px="3" 
                 borderRadius="5" rounded="md" maxW="100%">
                    <VStack space="1" divider={<Divider />}>
                        <Center px="3" pt="3">
                            <Image source={this.props.image} alt="Type of item" />
                            <Text style={{adjustsFontSizeToFit:"true"}}>{this.props.itemType}</Text>
                        </Center>
                    </VStack>
                </Box>
        );
    }
}