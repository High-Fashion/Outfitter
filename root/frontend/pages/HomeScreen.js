import React, { Component, useEffect, useState } from "react";

import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WardrobeScreen from "./WardrobeScreen.js";
import MediaScreen from "./MediaScreen";
import OutfitScreen from "./OutfitScreen";
import NewOutfitScreen from "./NewOutfitScreen.js";
import NewItemScreen from "./NewItemScreen.js";
import QuizScreen from "./QuizScreen.js";
import CategoryListScreen from "./CategoryListScreen.jsx";
import ItemListScreen from "./ItemListScreen.jsx";

import {
  Text,
  HStack,
  Box,
  Pressable,
  Center,
  SunIcon,
  MoonIcon,
  PlayIcon,
  View,
  QuestionIcon
} from "native-base";
import axiosInstance from "../utils/axiosInstance.js";
import { useAuth } from "../contexts/Auth";
import config from "../config";

function Footer(props) {
  const { navigationRef, show } = props;
  const [selected, setSelected] = useState(0);
  const screens = {
    0: "Wardrobe",
    1: "Media",
    2: "Outfits",
    3: "Quiz"
  };
  function selectScreen(number) {
    setSelected(number);
    if (navigationRef.isReady()) {
      navigationRef.navigate(screens[number]);
    }
  }
  if (show == false) return <></>;
  return (
    <Box bg="white" width="100%" alignSelf="center">
      <Center flex={1}></Center>
      <HStack bg="indigo.600" alignItems="center" safeAreaBottom shadow={6}>
        <Pressable
          cursor="pointer"
          opacity={selected === 0 ? 1 : 0.5}
          py="3"
          flex={1}
          onPress={() => selectScreen(0)}
        >
          <Center>
            <SunIcon mb="1" color="white" size="sm" />
            <Text color="white" fontSize="12">
              Wardrobe
            </Text>
          </Center>
        </Pressable>
        <Pressable
          cursor="pointer"
          opacity={selected === 1 ? 1 : 0.5}
          py="2"
          flex={1}
          onPress={() => selectScreen(1)}
        >
          <Center>
            <PlayIcon mb="1" color="white" size="sm" />
            <Text color="white" fontSize="12">
              Media
            </Text>
          </Center>
        </Pressable>
        <Pressable
          cursor="pointer"
          opacity={selected === 2 ? 1 : 0.6}
          py="2"
          flex={1}
          onPress={() => selectScreen(2)}
        >
          <Center>
            <MoonIcon mb="1" color="white" size="sm" />
            <Text color="white" fontSize="12">
              Outfits
            </Text>
          </Center>
        </Pressable>
        <Pressable
          cursor="pointer"
          opacity={selected === 3 ? 1 : 0.5}
          py="2"
          flex={1}
          onPress={() => selectScreen(3)}
        >
          <Center>
            <QuestionIcon mb="1" color="white" size="sm" />
            <Text color="white" fontSize="12">
              Quiz
            </Text>
          </Center>
        </Pressable>
      </HStack>
    </Box>
  );
}

const Stack = createNativeStackNavigator();

function HomeScreen() {
  const navigationRef = useNavigationContainerRef();
  const { user } = useAuth();
  const [isSetup, setIsSetup] = useState(user.wardrobe != null);

  const initialRouteName = isSetup ? "Wardrobe" : "Setup";

  return (
    <View flex={1}>
      <View flex={1} my={0}>
        <NavigationContainer ref={navigationRef} independent={true}>
          <Stack.Navigator initialRouteName={initialRouteName}>
            <Stack.Group>
              <Stack.Group>
                <Stack.Screen
                  name="Wardrobe"
                  component={WardrobeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="NewItem"
                  component={NewItemScreen}
                  options={{ title: "New Item" }}
                />
                <Stack.Group screenOptions={{ presentation: "modal" }}>
                  <Stack.Screen
                    name="CategoryList"
                    component={CategoryListScreen}
                    options={{ title: "Clothing Types" }}
                  />
                  <Stack.Screen
                    name="ItemList"
                    component={ItemListScreen}
                    options={({ route }) => ({ title: route.params.name })}
                  />
                </Stack.Group>
              </Stack.Group>
              <Stack.Screen
                name="Outfits"
                component={OutfitScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NewOutfit"
                component={NewOutfitScreen}
                options={{ title: "New Outfit" }}
              />
              <Stack.Screen
                name="Media"
                component={MediaScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={{ headerShown: false }}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      <Footer show={isSetup} navigationRef={navigationRef} />
    </View>
  );
}

export default HomeScreen;
