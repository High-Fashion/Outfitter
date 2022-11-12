import {
  Box,
  Image,
  View,
  Icon,
  Avatar as NativeBaseAvatar,
  VStack,
} from "native-base";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function Avatar(props) {
  const iconSize = props.navBar ? 34 : 90;
  return (
    <VStack>
      <NativeBaseAvatar
        size={iconSize}
        source={{
          uri: props.image,
        }}
        backgroundColor="transparent"
      >
        {props.focused ? (
          <Ionicons size={iconSize} name="person-circle" />
        ) : (
          <Ionicons size={iconSize} name="person-circle-outline" />
        )}
      </NativeBaseAvatar>
    </VStack>
  );
}
