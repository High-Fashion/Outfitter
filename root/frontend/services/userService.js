import axiosInstance from "../utils/axiosInstance";
import config from "../config";

async function getUsers() {
  const response = await axiosInstance.get(config.API_URL + "/users/");
  return response.data;
}

async function getUser(id) {
  const response = await axiosInstance.get(config.API_URL + "/users/" + id);
  const user = response.data;
  return user;
}

async function followUser(user, bool) {
  console.log("Following user", user);
  const response = await axiosInstance.post(
    config.API_URL + "/users/follow/" + user.id,
    { follow: bool }
  );
  return response.status == 200;
}

module.exports = {
  getUsers,
  followUser,
  getUser,
};
