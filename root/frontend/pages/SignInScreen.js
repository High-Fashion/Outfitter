import {
  Heading,
  Stack,
  Input,
  Text,
  Divider,
  FormControl,
  VStack,
  HStack,
  Button,
  ScrollView,
  View,
  Image,
} from "native-base";
import { useAuth } from "../contexts/Auth";
import { useState } from "react";

function SignInScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();

  const submit = () => {
    signIn({ username: username, password: password });
  };

  return (
    <ScrollView>
      <VStack paddingTop={4} alignItems="center" space={3} paddingBottom={4}>
        <VStack alignItems="center" paddingBottom={4}>
          <HStack
            style={{
              position: "relative",
              left: 20,
            }}
            alignItems="center"
          >
            <Heading size="xl">Outfitter</Heading>
            <View>
              <Image
                resizeMode="contain"
                source={require("../assets/logo.png")}
                style={{
                  width: 40,
                  height: 40,
                }}
              />
            </View>
          </HStack>
          <Text>Sign in to continue tracking your wardrobe</Text>
        </VStack>
        <Divider />
        <FormControl paddingX={10} paddingBottom={1}>
          <Stack>
            <Stack>
              <FormControl.Label>Username</FormControl.Label>
              <Input
                isRequired
                value={username}
                onChangeText={(text) => setUsername(text)}
                variant="outline"
                p={2}
                placeholder="Username"
              />
            </Stack>
            <Stack>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                variant="outline"
                isRequired
                p={2}
                placeholder="Password"
              />
            </Stack>
          </Stack>
        </FormControl>
        <Button onPress={() => submit()}>Sign In</Button>
        <Divider />
        <Text>Dont have an account?</Text>
        <Button
          onPress={() => {
            navigation.navigate("Sign Up");
          }}
        >
          Sign Up
        </Button>
      </VStack>
    </ScrollView>
  );
}
export default SignInScreen;
