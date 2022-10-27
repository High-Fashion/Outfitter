import { NativeBaseProvider } from "native-base";

import React from "react";

import { AuthProvider } from "./contexts/Auth";
import Router from "./Router";

export default function App() {
  return (
    <NativeBaseProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </NativeBaseProvider>
  );
}
