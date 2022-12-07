import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { View } from "native-base";

import * as SplashScreen from "expo-splash-screen";
import EditProfileScreen from "./pages/EditProfileScreen.js";
import ItemScreen from "./pages/ItemScreen.js";
import NewOutfitScreen from "./pages/NewOutfitScreen.js";
import SignInScreen from "./pages/SignInScreen.js";
import SignUpScreen from "./pages/SignUpScreen.js";
import SimilarOutfitScreen from "./pages/SimilarOutfitScreen.js";

import {
  BodyShape,
  PrivacySettings,
  SetupScreen,
  StyleQuiz,
  WardrobeSettings,
} from "./pages/SetupScreen.js";

import { useCallback, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import Footer from "./components/Footer.js";
import config from "./config";
import { useAuth } from "./contexts/Auth";
import PeopleListScreen from "./pages/PeopleListScreen.js";
import PostScreen from "./pages/PostScreen.js";
import axiosInstance from "./utils/axiosInstance";

const Stack = createNativeStackNavigator();

//SetupStack
const finishSetup = async (data) => {
  const response = await axiosInstance.post(
    config.API_URL + "/wardrobe/create",
    data
  );
  if (response.status == 200) {
    return true;
  }
};

export default function Router() {
  const [isSetup, setIsSetup] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [navReady, setNavReady] = useState(false);
  const { signedIn, refreshUser, getTokens, user, signOut } = useAuth();

  useEffect(() => {
    if (!appIsReady) return;
    if (user?.wardrobe) {
      setIsSetup(true);
    }
  }, [user, appIsReady]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        const keys = await getTokens();
        await new Promise(async (resolve) => {
          if (!keys) {
            resolve();
            return;
          }
          let bool = await refreshUser();
          resolve();
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View flex={1}>
      <View flex={1}>
        <NavigationContainer>
          <Stack.Navigator>
            {signedIn ? (
              isSetup ? (
                <Stack.Group>
                  <Stack.Screen
                    name="Root"
                    component={Footer}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="Post" component={PostScreen} />
                  <Stack.Screen
                    name="PeopleList"
                    component={PeopleListScreen}
                  />
                  <Stack.Screen
                    name="Item"
                    component={ItemScreen}
                    options={{ title: "Editing" }}
                  />
                  <Stack.Screen
                    name="NewOutfit"
                    component={NewOutfitScreen}
                    options={({ navigation, route }) => ({
                      headerTitle: route?.params?.title
                        ? route.params.title
                        : "New Outfit",
                    })}
                  />
                  <Stack.Screen
                    name="Similar Outfits"
                    component={SimilarOutfitScreen}
                    options={{ headershown: true }}
                  />
                  <Stack.Screen
                    name="EditProfile"
                    component={EditProfileScreen}
                    options={{ title: "Edit Profile" }}
                  />
                </Stack.Group>
              ) : (
                <Stack.Group>
                  <Stack.Screen
                    name="Setup"
                    component={SetupScreen}
                    initialParams={{ finish: (data) => finishSetup(data) }}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="Wardrobe Settings"
                    component={WardrobeSettings}
                    options={{ headerShown: true }}
                  />
                  <Stack.Screen
                    name="Body Shape"
                    component={BodyShape}
                    options={{ headerShown: true }}
                  />
                  <Stack.Screen
                    name="Style Quiz"
                    component={StyleQuiz}
                    options={{ headerShown: true }}
                  />
                  <Stack.Screen
                    name="Privacy Settings"
                    component={PrivacySettings}
                    options={{ headerShown: true }}
                  />
                </Stack.Group>
              )
            ) : (
              <Stack.Group>
                <Stack.Screen name="Sign Up" component={SignUpScreen} />
                <Stack.Screen name="Sign In" component={SignInScreen} />
              </Stack.Group>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}
