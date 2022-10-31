import { Text, View, Button, VStack } from "native-base";
import { useAuth } from "../contexts/Auth";
import { useEffect } from "react";

function MediaScreen({ navigation }) {
  const { user } = useAuth();
  return (
    <View>{user.firstName && <Text>Welcome back, {user.firstName}</Text>}</View>
  );
}

export default MediaScreen;
