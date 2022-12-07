import { Icon } from "native-base";

import HomeScreen from "../pages/HomeScreen.js";
import OutfitScreen from "../pages/OutfitScreen.js";
import { ProfileScreen } from "../pages/ProfileScreen.js";
import WardrobeScreen from "../pages/WardrobeScreen.js";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Avatar from "./Avatar";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
function HomeScreenNav() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="UserProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function WardrobeIcon({ focused }) {
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
}

function HomeIcon({ focused }) {
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
}

function OutfitIcon({ focused }) {
  return focused ? (
    <Icon size="xl" color={"black"} as={<Ionicons name="body" />} />
  ) : (
    <Icon size="xl" color={"black"} as={<Ionicons name="body-outline" />} />
  );
}

function ProfileIcon({ focused }) {
  return (
    <Avatar
      focused={focused}
      navBar
      emptyIconColor={focused ? "indigo.900" : "black"}
    />
  );
}

const Tab = createBottomTabNavigator();

export default function Footer() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <WardrobeIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreenNav}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Outfits"
        component={OutfitScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <OutfitIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
