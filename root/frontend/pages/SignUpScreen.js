import {
  Heading,
  Stack,
  Input,
  View,
  Text,
  Divider,
  FormControl,
  VStack,
  HStack,
  Button,
  ScrollView,
  Checkbox,
  Pressable,
  Card,
  Box,
} from "native-base";

function TOS({ navigation }) {
  return (
    <Box p={4} borderColor="coolGray.300" borderWidth="1" rounded="md">
      <HStack alignItems="center" justifyContent="center">
        <Checkbox />
        <HStack space={1} mx={4} alignItems="center">
          <Text>I agree to Outfitters</Text>
          <Pressable
            onPress={() => {
              navigation.navigate("Home");
            }}
          >
            <Text color="blue.900">Terms & Conditions</Text>
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  );
}

function SignUpScreen({ navigation }) {
  return (
    <ScrollView>
      <VStack paddingTop={4} alignItems="center" space={2} paddingBottom={4}>
        <VStack alignItems="center" paddingBottom={4}>
          <Heading size="xl">Outfitter</Heading>
          <Text>Sign up to begin tracking your wardrobe</Text>
        </VStack>
        <Divider />
        <FormControl paddingX={10} paddingBottom={1}>
          <Stack space={1}>
            <Stack>
              <FormControl.Label>Email Address</FormControl.Label>
              <Input
                isRequired
                variant="outline"
                p={2}
                placeholder="Email Address"
              />
            </Stack>
            <Stack>
              <FormControl.Label>Full Name</FormControl.Label>
              <Input
                isRequired
                variant="outline"
                p={2}
                placeholder="Full Name"
              />
            </Stack>
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
              <FormControl.HelperText>
                Must be atleast 6 characters.
              </FormControl.HelperText>
            </Stack>
            <TOS navigation={navigation} />
          </Stack>
        </FormControl>
        <Button>
          <Text>Sign Up</Text>
        </Button>
        <Divider />
        <Text>Already have an account?</Text>
        <Button
          onPress={() => {
            navigation.navigate("Sign In");
          }}
        >
          <Text>Sign In</Text>
        </Button>
      </VStack>
    </ScrollView>
  );
}
export default SignUpScreen;
