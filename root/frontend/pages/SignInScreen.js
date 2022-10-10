import {
  Heading,
  Stack,
  Input,
  View,
  Text,
  Divider,
  FormControl,
  VStack,
  Button,
  ScrollView,
} from "native-base";

function SignInScreen({ navigation }) {
  return (
    <ScrollView>
      <VStack paddingTop={4} alignItems="center" space={3} paddingBottom={4}>
        <VStack alignItems="center" paddingBottom={4}>
          <Heading size="xl">Outfitter</Heading>
          <Text>Sign in to continue tracking your wardrobe</Text>
        </VStack>
        <Divider />
        <FormControl paddingX={10} paddingBottom={1}>
          <Stack>
            <Stack>
              <FormControl.Label>Username</FormControl.Label>
              <Input
                isRequired
                variant="outline"
                p={2}
                placeholder="Username"
              />
            </Stack>
            <Stack>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type="password"
                variant="outline"
                isRequired
                p={2}
                placeholder="Password"
              />
            </Stack>
          </Stack>
        </FormControl>
        <Button>
          <Text>Sign In</Text>
        </Button>
        <Divider />
        <Text>Dont have an account?</Text>
        <Button
          onPress={() => {
            navigation.navigate("Sign Up");
          }}
        >
          <Text>Sign Up</Text>
        </Button>
      </VStack>
    </ScrollView>
  );
}
export default SignInScreen;
