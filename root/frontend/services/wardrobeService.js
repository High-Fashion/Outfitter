import axiosInstance from "../utils/axiosInstance";
import config from "../config";

function getWardrobe() {}

function getItems() {}

function getShoes() {}

function getAccessories() {}

async function addItem(item) {
  console.log("adding ", item);
  const response = await axiosInstance.post(
    config.API_URL + "/item/create",
    item
  );
  console.log(response.data);
  return response.status == 200;
}

async function deleteItem(id) {
  console.log("deleting item", id);
  const response = await axiosInstance.delete(
    config.API_URL + "/item/" + id,
  );
  console.log(response.data);
  return response.status == 200;
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
  const response = await axiosInstance.delete(
    config.API_URL + "/outfit/" + id,
  );
  console.log(response.data);
  return response.status == 200;
}

module.exports = {
  addItem,
  deleteItem,
  addOutfit,
  deleteOutfit,
};
