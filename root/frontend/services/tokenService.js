import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../config";

let jwt_decode = require("jwt-decode");

async function getAccessUsingRefresh(refresh_token) {
  return await axios
    .post(config.API_URL + "/refresh", { refresh_token: refresh_token })
    .then((res) => {
      return res.data;
    });
}

async function getVerifiedKeys(keys) {
  // console.log("Loading keys");
  if (keys) {
    // console.log("Checking access_token");
    if (!isTokenExpired(keys.access_token)) {
      // console.log("Returning access_token");
      return keys;
    } else {
      // console.log("Access_token expired");
      // console.log("Checking refresh_token expiration");
      if (!isTokenExpired(keys.refresh_token)) {
        // console.log("Refreshing access_token using refresh_token");
        const response = await getAccessUsingRefresh(keys.refresh_token);
        await AsyncStorage.setItem(
          "keys",
          JSON.stringify({
            access_token: response.access_token,
            refresh_token: response.refresh_token,
          })
        );
        // console.log("Updated tokens");
        return response;
      } else {
        // console.log("Refresh_token expired, redirecting to sign in");
        return null;
      }
    }
  } else {
    // console.log("Access_token missing");
    return null;
  }
}

function isTokenExpired(token) {
  console.log("Checking: ", token);
  try {
    let decoded = jwt_decode(token);
    // console.log(decoded);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return true;
  }
}

const setCredentials = async (keys) => {
  try {
    // console.log("saving: ", JSON.stringify(keys));
    await AsyncStorage.setItem("keys", JSON.stringify(keys));
  } catch (e) {
    console.log(e);
  }
};

const getCredentials = async () => {
  try {
    let credentials = await AsyncStorage.getItem("keys");
    if (!credentials) return null;
    let cred = await getVerifiedKeys(JSON.parse(credentials));
    if (credentials != null && cred != null) {
      return cred;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

const removeUser = async () => {
  await AsyncStorage.removeItem("keys");
  return true;
};

export default {
  getCredentials,
  setCredentials,
  removeUser,
};
