import React, { useState, useEffect } from "react";
import { Button, VStack, Text, Center, View, Box, HStack } from "native-base";

import { HeaderBackButton } from "@react-navigation/elements";

import PanPinchView from "react-native-pan-pinch-view";
import { Dimensions, Image, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const CONTAINER = {
  width: width,
  height: 400,
};

const CONTENT = {
  width: width / 2,
  height: 400,
};

export default function Model(props) {
  const [focus, setFocus] = useState("whole");

  useEffect(() => {
    if (focus != "whole") {
      props.navigation.setOptions({
        headerLeft: () => (
          <HeaderBackButton onPress={() => setFocus("whole")} />
        ),
        headerTitle: focus.charAt(0).toUpperCase() + focus.slice(1),
      });
    } else {
      props.navigation.setOptions({
        headerLeft: () => (
          <HeaderBackButton onPress={() => props.navigation.goBack()} />
        ),
        headerTitle: "New Outfit",
      });
    }
  }, [focus]);

  return (
    <View>
      {focus == "whole" && (
        <PanPinchView
          minScale={1}
          initialScale={1}
          maxScale={2}
          initialPan={1}
          containerDimensions={{
            width: CONTAINER.width,
            height: CONTAINER.height,
          }}
          contentDimensions={{ width: CONTENT.width, height: CONTENT.height }}
        >
          <Center>
            <Image
              source={require("../assets/bodytypes/men_inverted_triangle.png")}
              resizeMode="contain"
            />
          </Center>
        </PanPinchView>
      )}
    </View>
  );
}
