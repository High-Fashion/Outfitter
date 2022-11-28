import axiosInstance from "../utils/axiosInstance";
import config from "../config";
import axios from "axios";
import tokenService from "./tokenService";
// import id from "faker/lib/locales/id_ID";

function getWardrobe() {}

function getItems() {}

function getShoes() {}

function getAccessories() {}

async function addItem(item) {
  console.log("adding ", item);
  var formData = new FormData();
  let uri = item.image.uri;
  let filename = uri.split("/").pop();
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;
  formData.append("image", { uri: uri, name: filename, type });
  var newItem = item;
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

async function addOutfit(outfit) {
  console.log("adding ", outfit);
  const response = await axiosInstance.post(
    config.API_URL + "/outfit/create",
    outfit
  );
  console.log(response.data);
  return response.status == 200;
}

async function deleteOutfit(id) {
  console.log("deleting outfit", id);
  const response = await axiosInstance.delete(config.API_URL + "/outfit/" + id);
  console.log(response.data);
  return response.status == 200;
}

async function editOutfit(outfit, id) {
  console.log("edit outfit", id);
  return await axiosInstance
    .put(config.API_URL + "/outfit/" + id, item)
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
};
