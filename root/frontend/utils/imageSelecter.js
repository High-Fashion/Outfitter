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

const { width } = Dimensions.get("window");

export default function ImageSelecter(props) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      props.setImage(result.assets[0]);
    }
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });

    if (!result.canceled) {
      props.setImage(result.assets[0]);
    }
  };

  const [open, setOpen] = useState(true);
  const startingHeight = 20;
  const fullHeight = 200;
  const animatedHeight = useRef(new Animated.Value(startingHeight)).current;

  useEffect(() => {
    Animated.spring(animatedHeight, {
      friction: 100,
      toValue: open
        ? props.image
          ? (width / props.image.width) * props.image.height
          : fullHeight
        : startingHeight,
      useNativeDriver: false,
    }).start();
  }, [open, props.image]);

  return (
    <View bgColor="coolGray.500">
      <Animated.View
        style={{
          overflow: "hidden",
          height: animatedHeight,
        }}
      >
        {props.image ? (
          <Image
            alt="selected clothing item"
            source={
              props.image
                ? { uri: props.image.uri }
                : require("../assets/emptyimage.png")
            }
            style={{
              width: width,
              height: (width / props.image.width) * props.image.height,
            }}
          />
        ) : (
          <Center style={{ height: fullHeight }}>
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
          </Center>
        )}
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
