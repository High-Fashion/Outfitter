import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import config from "../config";
import axiosInstance from "../utils/axiosInstance";
import TokenService from "../services/tokenService";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [signedIn, setSignedIn] = useState(false);

  const signIn = (body) => {
    axios
      .post(config.API_URL + "/signin", {
        username: body.username,
        password: body.password,
      })
      .then((res) => {
        if (res.data.success == true) {
          TokenService.setCredentials({
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token,
          });
        }
        refreshUser();
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signUp = async (body) => {
    const response = await axios
      .post(config.API_URL + "/signup", {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        acceptTerms: body.acceptTerms,
        username: body.username,
        password: body.password,
      })
      .catch((err) => console.log(err));
    if (response.status == 201) return true;
  };

  const signOut = async () => {
    await TokenService.removeUser();
    setSignedIn(false);
    setUser(undefined);
    return true;
  };

  const refreshUser = async () => {
    const response = await axiosInstance.get(config.API_URL + "/user/");
    if (!response.data) return false;
    setUser(response.data);
    setSignedIn(true);
    return true;
  };

  const getTokens = async () => {
    const keys = await TokenService.getCredentials();
    return keys;
  };

  return (
    <AuthContext.Provider
      value={{
        signedIn,
        user,
        signIn,
        signUp,
        signOut,
        refreshUser,
        getTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
