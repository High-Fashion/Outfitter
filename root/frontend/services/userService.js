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

async function updateUser(id, user) {
  console.log("editing ", user);
  return await axiosInstance
    .put(config.API_URL + "/users/" + id, user)
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
  getUsers,
  followUser,
  getUser,
  updateUser
};
