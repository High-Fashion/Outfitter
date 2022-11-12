import { NativeBaseProvider } from "native-base";

import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./contexts/Auth";
import Router from "./Router";
import theme from "./theme";

const colorModeManager = {
  get: async () => {
    try {
      let val = await AsyncStorage.getItem("@color-mode");
      return val === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  },
  set: async (value) => {
    try {
      await AsyncStorage.setItem("@color-mode", value);
    } catch (e) {
      console.log(e);
    }
  },
};

const nativeBaseConfig = {
  strictMode: "warn",
};

export default function App() {
  return (
    <NativeBaseProvider
      config={nativeBaseConfig}
      colorModeManager={colorModeManager}
      theme={theme}
    >
      <SafeAreaProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
