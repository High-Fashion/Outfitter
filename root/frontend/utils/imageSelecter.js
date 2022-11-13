import React, { useState, useEffect } from 'react';
import { Button, Image, View, HStack } from 'native-base';
import * as ImagePicker from 'expo-image-picker';


export default function ImageSelecter() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync()

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View alignItems={"center"}>
      <Image alt="selected clothing item" source={image ? { uri: image } : require("../assets/emptyimage.png")} style={{ width: 200, height: 200 }} />
      <HStack space={3} justifyContent="center" py = "2">
        <Button onPress={pickImage}>Choose Image</Button>
        <Button onPress={takePicture} >Take Picture</Button>
      </HStack>
    </View>
  );
}
