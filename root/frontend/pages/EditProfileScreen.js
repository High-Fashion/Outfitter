import { useNavigation } from "@react-navigation/native";
import { Center, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TextInput } from "react-native";
import Avatar from "../components/Avatar";
import CheckButton from "../components/CheckButton";
import { useAuth } from "../contexts/Auth";
import { updateUser } from "../services/userService";

export default function EditProfileScreen() {
  const { user, refreshUser } = useAuth();
  const [formData, setData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    bio: "",
  });

  const showEditAlert = () => {
    Alert.alert("Submit Changes?", "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
        cancelable: true,
      },
      { text: "Ok", onPress: handleSubmit },
    ]);
  };

  const handleSubmit = async () => {
    let res = await updateUser(user._id, formData);
    if (res == true) {
      refreshUser();
      console.log("RES IS: ", res);
    }
  };

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <CheckButton handlePress={showEditAlert} />,
    });
  });

  return (
    <ScrollView style={{ top: "10%" }}>
      <Center>
        <Avatar />
        <VStack width="80%" space="1">
          <Text>First Name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setData({ ...formData, firstName: text })}
            defaultValue={user.firstName}
            placeholder="First Name"
          ></TextInput>
          <Text>Last Name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setData({ ...formData, lastName: text })}
            defaultValue={user.lastName}
            placeholder="Last Name"
          ></TextInput>
          <Text>Bio</Text>
          <TextInput
            style={[styles.textInput]}
            multiline
            maxLength={200}
            onChangeText={(text) => setData({ ...formData, bio: text })}
            placeholder="Bio"
          ></TextInput>
        </VStack>
      </Center>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    margin: 2,
  },
});
