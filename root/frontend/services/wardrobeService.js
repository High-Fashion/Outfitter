import axios from "axios";
import config from "../config";
import axiosInstance from "../utils/axiosInstance";
import tokenService from "./tokenService";
// import id from "faker/lib/locales/id_ID";

function getWardrobe() {}

function getItems() {}

function getShoes() {}

function getAccessories() {}

async function getImage(imageName) {
  console.log(imageName);
  return await axiosInstance
    .get(config.API_URL + "/image/" + imageName)
    .then((res) => {
      if (res.status == 200) {
        return res.data.uri;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

async function addItem(item) {
  console.log("adding ", item);
  let formData = new FormData();
  if (item.image) {
    let uri = item.image.uri;
    let filename = uri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    formData.append("image", { uri: uri, name: filename, type });
  }
  let newItem = item;
  delete newItem.image;
  formData.append("data", JSON.stringify(item));
  const keys = await tokenService.getCredentials();
  if (!keys) return false;
  const { access_token } = keys;
  return await axios
    .post(config.API_URL + "/item/create", formData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log("res", res);
      return res.status == 200;
    })
    .catch((err) => {
      console.log("err", err);
      return false;
    });
}

async function editItem(item, id) {
  console.log("editing ", item);
  return await axiosInstance
    .put(config.API_URL + "/item/" + id, item)
    .then((res) => {
      console.log("res", res);
      return res.status == 200;
    })
    .catch((err) => {
      console.log("err", err);
      return false;
    });
}

async function deleteItem(id) {
  console.log("deleting item", id);
  return await axiosInstance
    .delete(config.API_URL + "/item/" + id)
    .then((res) => {
      console.log("res", res);
      return res.status == 200;
    })
    .catch((err) => {
      console.log("err", err);
      return false;
    });
}

function getOutfits() {}

async function addOutfit(outfit, image) {
  let formData = new FormData();
  if (image) {
    let uri = image.uri;
    let filename = uri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    formData.append("image", { uri: uri, name: filename, type });
  }
  formData.append("data", JSON.stringify(outfit));
  const keys = await tokenService.getCredentials();
  if (!keys) return false;
  const { access_token } = keys;
  return await axios
    .post(config.API_URL + "/outfit/create", formData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log("res", res);
      return res.status == 200;
    })
    .catch((err) => {
      console.log("err", err);
      return false;
    });
}

async function deleteOutfit(id) {
  console.log("deleting outfit", id);
  const response = await axiosInstance.delete(config.API_URL + "/outfit/" + id);
  console.log(response.data);
  return response.status == 200;
}

async function editOutfit(outfit, image, id) {
  console.log("edit outfit", id);
  return await axiosInstance
    .put(config.API_URL + "/outfit/" + id, outfit)
    .then((res) => {
      console.log("res", res);
      return res.status == 200;
    })
    .catch((err) => {
      console.log("err", err);
      return false;
    });
}

module.exports = {
  addItem,
  editItem,
  deleteItem,
  addOutfit,
  deleteOutfit,
  editOutfit,
  getImage,
};
