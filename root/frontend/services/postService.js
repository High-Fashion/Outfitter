import axios from "axios";
import config from "../config";
import axiosInstance from "../utils/axiosInstance";
import tokenService from "./tokenService";
// import id from "faker/lib/locales/id_ID";

function getWardrobe() {}

function getItems() {}

function getShoes() {}

function getAccessories() {}

async function getPost(id) {
  return await axiosInstance
    .get(config.API_URL + "/post/" + id)
    .then((res) => {
      if (res.status == 200) {
        return res.data;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

async function getPublicPosts() {
  return await axiosInstance
    .get(config.API_URL + "/post/")
    .then((res) => {
      if (res.status == 200) {
        return res.data;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

async function getFollowPosts() {
  return await axiosInstance
    .get(config.API_URL + "/post/follow")
    .then((res) => {
      if (res.status == 200) {
        return res.data;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

async function addPost(post) {
  console.log("adding ", post);
  let formData = new FormData();
  if (post.image) {
    let uri = post.image.uri;
    let filename = uri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    formData.append("image", { uri: uri, name: filename, type });
  }
  let newPost = post;
  delete newPost.image;
  formData.append("data", JSON.stringify(post));
  console.log(formData);
  const keys = await tokenService.getCredentials();
  if (!keys) return false;
  const { access_token } = keys;
  return await axios
    .post(config.API_URL + "/post/create", formData, {
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

async function editPost(post, id) {
  console.log("editing ", post);
  return await axiosInstance
    .put(config.API_URL + "/post/" + id, post)
    .then((res) => {
      console.log("res", res);
      return res.status == 200;
    })
    .catch((err) => {
      console.log("err", err);
      return false;
    });
}

async function deletePost(id) {
  console.log("deleting item", id);
  return await axiosInstance
    .delete(config.API_URL + "/post/" + id)
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
  getPost,
  getPublicPosts,
  getFollowPosts,
  addPost,
  editPost,
  deletePost,
};
