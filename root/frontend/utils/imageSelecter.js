import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Image,
  View,
  HStack,
  Icon,
  Box,
  Text,
  VStack,
  Center,
} from "native-base";
import * as ImagePicker from "expo-image-picker";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Animated, Dimensions } from "react-native";

export default function ImageSelecter({selectedImage}) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("result is: ", result);
    console.log("image is: ", image)

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      selectedImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      selectedImage(result.assets[0].uri);
    }
  };

  const [open, setOpen] = useState(true);
  const startingHeight = 20;
  const fullHeight = 200;
  const animatedHeight = useRef(new Animated.Value(startingHeight)).current;

  useEffect(() => {
    Animated.spring(animatedHeight, {
      friction: 100,
      toValue: open ? fullHeight : startingHeight,
      useNativeDriver: false,
    }).start();
  }, [open]);

  return (
    <View bgColor="coolGray.500">
      <Animated.View
        style={{
          overflow: "hidden",
          height: animatedHeight,
        }}
      >
        <Center style={{ height: fullHeight }}>
          <Image source={image ? { uri: image } : require("../assets/emptyimage.png")} style={{ width: 200, height: 200}} />
          {image ? (
            <Image
              alt="selected clothing item"
              source={{ uri: image }}
              // resizeMode="contain"
              style={{ width: Dimensions.width, height: 200 }}
            />
          ) : (
            <VStack alignItems={"center"}>
              <Icon
                color={"gray.600"}
                size="5xl"
                as={<MaterialCommunityIcons name="image-off" />}
              />
              <Text bold color="gray.600">
                No Image
              </Text>
            </VStack>
          )}
        </Center>
        <VStack
          style={{
            zIndex: 2,
            position: "absolute",
            right: 10,
            paddingTop: fullHeight / 5,
            paddingBottom: fullHeight / 5,
            height: fullHeight,
            justifyContent: "space-between",
          }}
        >
          <Button borderRadius={"xl"} size="lg" onPress={pickImage}>
            <Icon
              color={"white"}
              as={<MaterialCommunityIcons name="folder-upload" />}
            />
          </Button>
          <Button borderRadius={"xl"} size="lg" onPress={takePicture}>
            <Icon color={"white"} as={<Ionicons name="camera" />} />
          </Button>
        </VStack>
      </Animated.View>
      <Box bgColor={"gray.100"} borderTopRadius="2xl">
        <VStack alignItems={"center"}>
          <Icon
            size="3xl"
            as={<AntDesign name="minus" />}
            onPress={() => setOpen(!open)}
          />
        </VStack>
      </Box>
    </View>
  );
}
