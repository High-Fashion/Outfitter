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
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();

  useEffect(() => {
    async function getCreds() {
      const { access_token } = await TokenService.getCredentials();
      if (access_token) {
        setToken(access_token);
        setSignedIn(true);
      }
    }
    getCreds();
  }, []);

  useEffect(() => {
    async function load() {
      console.log("loading user");
      refreshUser();
    }
    if (signedIn) load();
  }, [signedIn]);

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
        setSignedIn(true);

        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signUp = (body) => {
    console.log("Attempting post to: ", config.API_URL + "/signup");
    axios
      .post(config.API_URL + "/signup", {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        acceptTerms: body.acceptTerms,
        username: body.username,
        password: body.password,
      })
      .catch((err) => console.log(err));
  };

  const signOut = () => {
    //TODO write this function
    TokenService.removeUser();
  };

  const refreshUser = async () => {
    const response = await axiosInstance.get(config.API_URL + "/user/");
    console.log(response.data);
    setUser(response.data);
  };

  return (
    <AuthContext.Provider
      value={{ signedIn, user, loading, signIn, signUp, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
