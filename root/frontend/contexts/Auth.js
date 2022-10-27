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

  useEffect(() => {
    async function getCreds() {
      const { access_token } = await TokenService.getCredentials();
      if (access_token) {
        setSignedIn(true);
      }
    }
    getCreds();
  }, []);

  useEffect(() => {
    async function load() {
      console.log("loading user");
      const response = await axiosInstance.get(config.API_URL + "/user/");
      setUser(response.data);
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
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const signOut = () => {
    //TODO write this function
    TokenService.removeUser();
  };

  return (
    <AuthContext.Provider
      value={{ signedIn, user, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
