import { useState } from "react";
import {
  Text,
  HStack,
  Box,
  Pressable,
  Center,
  SunIcon,
  MoonIcon,
  PlayIcon,
  QuestionIcon,
  Icon,
  IconButton,
} from "native-base";
import { useAuth } from "../contexts/Auth";

import WardrobeScreen from "../pages/WardrobeScreen.js";
import HomeScreen from "../pages/HomeScreen.js";
import OutfitScreen from "../pages/OutfitScreen.js";
import ProfileScreen from "../pages/ProfileScreen.js";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import Avatar from "./Avatar";

const Tab = createBottomTabNavigator();

export default function Footer() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Icon
                size="xl"
                color={"black"}
                as={<MaterialCommunityIcons name="wardrobe" />}
              />
            ) : (
              <Icon
                size="xl"
                color={"black"}
                as={<MaterialCommunityIcons name="wardrobe-outline" />}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Icon
                size="xl"
                color={"black"}
                as={<MaterialCommunityIcons name="home-variant" />}
              />
            ) : (
              <Icon
                size="xl"
                color={"black"}
                as={<MaterialCommunityIcons name="home-variant-outline" />}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Outfits"
        component={OutfitScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Icon size="xl" color={"black"} as={<Ionicons name="body" />} />
            ) : (
              <Icon
                size="xl"
                color={"black"}
                as={<Ionicons name="body-outline" />}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <Avatar
                focused={focused}
                navBar
                emptyIconColor={focused ? "indigo.900" : "black"}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
