import { Button } from "native-base";
import { useState } from "react";
import { useAuth } from "../contexts/Auth";
import { followUser } from "../services/userService";

export default function FollowButton(props) {
  const { user, refreshUser } = useAuth();
  const [followLoading, setFollowLoading] = useState(false);
  function editProfile() {}

  async function follow() {
    setFollowLoading(true);
    var res = await followUser(
      props.user,
      props.user.private
        ? !user.sentRequests.includes(props.user._id)
        : !user.following.map((u) => u._id).includes(props.user._id)
    );
    await refreshUser();
    setFollowLoading(false);
  }

  return (
    <Button
      isLoading={followLoading}
      onPress={props.self ? editProfile : follow}
      p={1}
    >
      {props.self
        ? "Edit Profile"
        : props.user.private
        ? !user.sentRequests.includes(props.user._id)
          ? "Send follow request"
          : "Cancel follow request"
        : !user.following.map((u) => u._id).includes(props.user._id)
        ? "Follow"
        : "Unfollow"}
    </Button>
  );
}
