import {
  createNavigationContainerRef,
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { View } from "native-base";

import SignUpScreen from "./pages/SignUpScreen.js";
import SignInScreen from "./pages/SignInScreen.js";
import * as SplashScreen from "expo-splash-screen";
import NewOutfitScreen from "./pages/NewOutfitScreen.js";
import NewItemScreen from "./pages/NewItemScreen.js";
import EditItemScreen from "./pages/EditItemScreen.js";

import {
  BodyShape,
  SetupScreen,
  WardrobeSettings,
  PrivacySettings,
  StyleQuiz,
} from "./pages/SetupScreen.js";

import { useAuth } from "./contexts/Auth";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "./utils/axiosInstance";
import config from "./config";
import { Keyboard } from "react-native";
import Footer from "./components/Footer.js";

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
          var bool = await refreshUser();
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

  //AppStack
  // <Stack.Group>
  //   <Stack.Screen
  //     name="Home"
  //     component={HomeScreen}
  //     options={{
  //       title: "Outfitter",
  //       headerTitleAlign: "center",

  //       headerStyle: {
  //         backgroundColor: "#1e40af",
  //       },
  //       headerTintColor: "#fff",
  //       headerTitleStyle: {
  //         fontWeight: "bold",
  //       },
  //       headerLeft: () => <></>,
  //       headerRight: () => (
  //         <Pressable>
  //           <HamburgerIcon
  //             size="md"
  //             color="white"
  //             onPress={() => signOut()}
  //           />
  //         </Pressable>
  //       ),
  //     }}
  //   />
  // </Stack.Group>

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
                    <Stack.Screen
                      name="NewItem"
                      component={NewItemScreen}
                      options={{ title: "New Item" }}
                    />
                    <Stack.Screen
                      name="EditItem"
                      component={EditItemScreen}
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
