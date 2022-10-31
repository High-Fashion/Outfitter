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

function getOutfits() {}

function createOutfit() {}

module.exports = {
  addItem,
};
