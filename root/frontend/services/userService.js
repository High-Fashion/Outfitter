import axiosInstance from "../utils/axiosInstance";
import config from "../config";

async function getUsers() {
  return await axiosInstance
    .get(config.API_URL + "/users/")
    .then((res) => {
      if (res.status == 200) {
        return res.data;
      } else {
        return false;
      }
    })
    .catch((err) => {
      return false;
    });
}

async function getUser(id) {
  console.log("Getting user: ", id);
  return await axiosInstance
    .get(config.API_URL + "/users/" + id)
    .then((res) => {
      if (res.status == 200) {
        console.log("Getting user: ", id);
        return res.data;
      } else {
        return false;
      }
    })
    .catch((err) => {
      return false;
    });
}

async function followUser(user, bool) {
  console.log("Following user", user._id);
  return await axiosInstance
    .post(config.API_URL + "/users/follow/" + user._id, { follow: bool })
    .then((res) => {
      // console.log("res", res);
      return res.status == 200;
    })
    .catch((err) => {
      // console.log("err", err);
      return false;
    });
}

module.exports = {
  getUsers,
  followUser,
  getUser,
};
