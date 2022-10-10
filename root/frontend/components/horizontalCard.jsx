import React, { Component } from 'react';
import { Text, Image, VStack, HStack, Box, Divider, Center } from 'native-base';


export default class HorizontalCard extends Component {

    render() {
        return (
            <Box bgColor="#ffffff" mt="1" elevation={3} cornerRadius="5" marginX="2">
              <HStack space="4">
                <Box px="4" pt="4" justifyContent="center" alignItems="center" >
                    <Image source={require("../assets/hanger.png")} alt="Type of item" />
                </Box>
                <Box px="4" justifyContent="center" alignItems="center">
                  <Text>{this.props.itemType}</Text>
                </Box>
              </HStack>
            </Box>
          );
    }
}