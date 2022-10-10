import React, { Component, useState } from "react";
import { Button, Image, Box, HStack, VStack, Text } from "native-base";

import * as ImagePicker from "expo-image-picker";

//TODO Styling and get image picker/camera to work  
const pickImage = async() => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Image,
    allowsEditing: true,
    aspect: [4,3],
    quality: 1,
  });

  if (!result.cancelled) {
    this.setImage(result.uri);
  } else {
    return null;
  }
}
  
function NewItemScreen({ navigation }) {
    const [image, setImage] = useState(null);
    return (
      <Box alignItems="center" justifyContent="center">
        <VStack space={3}>
          <Box w="200" h="200" bgColor="coolGray.300" mt="10%">
            Image goes here
          </Box>
          {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}
          <HStack space={1}>
            <Button>
              TODO: Take Photo
            </Button>
            <Button  onPress={() => this.setImage = pickImage()}>
              TODO: Select Image
            </Button>
          </HStack>
          <Button onPress={() => {navigation.navigate("CategoryList") }}>
            Item Type
          </Button>
          </VStack>
      </Box>
    );
}

export default NewItemScreen;