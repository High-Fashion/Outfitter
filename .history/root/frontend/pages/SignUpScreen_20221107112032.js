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
import { React, useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/Auth";
import { Image } from "react-native";

const validator = require("validator");

function SignUpScreen({ navigation }) {
  const [formData, setData] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({
    email: null,
    name: null,
    username: null,
    password: null,
    confirmPassword: null,
    acceptTerms: null,
  });
  const { signUp } = useAuth();

  const validateEmail = () => {
    //Validate email
    if (!formData.email || validator.isEmpty(formData.email)) {
      setErrors({ ...errors, email: null });
      return false;
    }
    if (!validator.isEmail(formData.email)) {
      setErrors({ ...errors, email: "Invalid email address." });
      return false;
    }
    setErrors({ ...errors, email: null });
    return true;
  };

  const validateName = () => {
    //Validate name
    if (
      !formData.firstName ||
      !formData.lastName ||
      formData.firstName === "" ||
      formData.lastName === ""
    ) {
      setErrors({ ...errors, name: "Invalid name" });
      return false;
    }
    if (
      !validator.isAlpha(formData.firstName, ["en-US"], { ignore: " -" }) ||
      !validator.isAlpha(formData.lastName, ["en-US"], { ignore: " -" })
    ) {
      setErrors({ ...errors, name: "Name is invalid" });
      return false;
    }
    setErrors({ ...errors, name: null });
    return true;
  };

  const validateUsername = () => {
    // Validate username
    if (!formData.username || formData.username === "") {
      setErrors({ ...errors, username: null });
      return false;
    }
    if (
      !validator.isAlphanumeric(formData.username, ["en-US"], {
        ignore: "-_.",
      })
    ) {
      setErrors({ ...errors, username: "Username is invalid." });
      return false;
    }
    setErrors({ ...errors, username: null });
    return true;
  };

  const validatePassword = () => {
    //Validate password
    if (!formData.password || formData.password === "") {
      setErrors({ ...errors, password: null });
      return false;
    }
    if (!validator.isStrongPassword(formData.password)) {
      setErrors({ ...errors, password: "Password is too weak." });
      return false;
    }
    setErrors({ ...errors, password: null });
    return true;
  };

  const validateConfirmPassword = () => {
    if (!formData.confirmPassword || formData.confirmPassword === "") {
      setErrors({
        ...errors,
        confirmPassword: null,
      });
      return false;
    }
    if (formData.password != formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match." });
      return false;
    }
    setErrors({ ...errors, confirmPassword: null });
    return true;
  };

  const validateAcceptTerms = () => {
    if (acceptTerms === undefined || acceptTerms === false) {
      setErrors({
        ...errors,
        acceptTerms: "Please accept the terms and conditions.",
      });
      return false;
    }
    setErrors({ ...errors, acceptTerms: null });
    return true;
  };

  const validate = () => {
    var temp = {};
    var valid = true;
    console.log(formData);

    //Validate email
    if (!formData.email || validator.isEmpty(formData.email)) {
      temp["email"] = "Email is required.";
      valid = false;
    }
    //Validate name
    if (
      !formData.firstName ||
      !formData.lastName ||
      formData.firstName === "" ||
      formData.lastName === ""
    ) {
      temp["name"] = "Full name is required.";
      valid = false;
    }
    // Validate username
    if (!formData.username || formData.username === "") {
      temp["username"] = "Username is required.";
      valid = false;
    }
    //Validate password
    if (!formData.password || formData.password === "") {
      temp["password"] = "Password is required.";
      valid = false;
    }
    if (!formData.confirmPassword || formData.confirmPassword === "") {
      temp["confirmPassword"] = "Please confirm your password.";
      valid = false;
    }
    if (acceptTerms === undefined || acceptTerms === false) {
      temp["acceptTerms"] = "Please accept the terms and conditions.";
      valid = false;
    }
    setErrors({ ...errors, ...temp });
    return valid;
  };

  const submit = async () => {
    if (validate() == true) {
      console.log("Valid.");
      const response = await signUp({ ...formData, acceptTerms: acceptTerms });
      if (response == true) {
        navigation.navigate("Sign In");
      }
    }
  };

  const setName = (name) => {
    var nameSplit = name.split(/\s+/);
    if (nameSplit.length < 2 || nameSplit[1] == "") {
      setData({ ...formData, firstName: "", lastName: "" });
      validateName();

      return;
    }
    var temp = nameSplit
      .splice(1, nameSplit.length)
      .toString()
      .split(",")
      .join(" ");
    setData({ ...formData, firstName: nameSplit[0], lastName: temp.trim() });
    validateName();
  };

  useEffect(() => {
    validateEmail();
  }, [formData.email]);

  useEffect(() => {
    validateUsername();
  }, [formData.username]);

  useEffect(() => {
    validatePassword();
  }, [formData.password]);

  useEffect(() => {
    validateConfirmPassword();
  }, [formData.confirmPassword]);

  const termsRef = useRef(false);
  useEffect(() => {
    if (termsRef.current) {
      validateAcceptTerms();
    } else {
      termsRef.current = true;
    }
  }, [acceptTerms]);

  return (
    <ScrollView>
      <Text>{formData.email}</Text>
      <Stack paddingTop={4} alignItems="center" space={2} paddingBottom={4}>
        <VStack alignItems="center" paddingBottom={4}>
          <Image
            source={require("../assets/logo.png")}
            style={{
              width: 75,
              height: 75,
              position: "absolute",
              left: 180,
              top: -30,
            }}
          />
          <Heading size="xl">Outfitter</Heading>
          <Text>Sign up to begin tracking your wardrobe</Text>
        </VStack>
        <Divider />
        <Stack paddingX={10} paddingBottom={1}>
          <Box>
            <FormControl isRequired isInvalid={errors?.email != null}>
              <FormControl.Label>Email Address</FormControl.Label>
              <Input
                onChangeText={(text) => {
                  setData({ ...formData, email: text });
                }}
                variant="outline"
                p={2}
                placeholder="Email Address"
              />
              <FormControl.ErrorMessage>
                {errors.email}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
          <Box>
            <FormControl isRequired isInvalid={errors?.name != null}>
              <FormControl.Label>Full Name</FormControl.Label>
              <Input
                onChangeText={(text) => {
                  setName(text);
                }}
                variant="outline"
                p={2}
                placeholder="Full Name"
              />
              <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
            </FormControl>
          </Box>
          <Box>
            <FormControl isRequired isInvalid={errors?.username != null}>
              <FormControl.Label>Username</FormControl.Label>
              <Input
                onChangeText={(text) => {
                  setData({ ...formData, username: text });
                }}
                variant="outline"
                p={2}
                placeholder="Username"
              />
              <FormControl.ErrorMessage>
                {errors.username}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
          <Box>
            <FormControl isRequired isInvalid={errors?.password != null}>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                onChangeText={(text) => {
                  setData({ ...formData, password: text });
                }}
                type="password"
                variant="outline"
                p={2}
                placeholder="Password"
              />
              <FormControl.HelperText>
                Must contain 8 characters, one symbol, one uppercase letter, and
                one lowercase letter.
              </FormControl.HelperText>
              <FormControl.ErrorMessage>
                {errors.password}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
          <Box>
            <FormControl isRequired isInvalid={errors?.confirmPassword != null}>
              <FormControl.Label>Confirm Password</FormControl.Label>
              <Input
                onChangeText={(text) => {
                  setData({ ...formData, confirmPassword: text });
                }}
                type="password"
                variant="outline"
                p={2}
                placeholder="Confirm Password"
              />
              {"confirmPassword" in errors && (
                <FormControl.ErrorMessage>
                  {errors.confirmPassword}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <Box py="2">
              <FormControl isRequired isInvalid={errors?.acceptTerms != null}>
                <Box
                  p={4}
                  borderColor="coolGray.300"
                  borderWidth="1"
                  rounded="md"
                >
                  <HStack alignItems="center" justifyContent="center">
                    <Checkbox
                      accessibilityLabel="Accept terms and conditions"
                      isSelected={acceptTerms}
                      onChange={(isSelected) => setAcceptTerms(isSelected)}
                    />
                    <HStack space={1} mx={4} alignItems="center">
                      <Text>I agree to Outfitters</Text>
                      <Pressable
                        onPress={() => {
                          navigation.navigate("HomeScreen");
                        }}
                      >
                        <Text color="blue.900">Terms & Conditions</Text>
                      </Pressable>
                    </HStack>
                  </HStack>
                </Box>
                {errors.acceptTerms && (
                  <FormControl.ErrorMessage>
                    {errors.acceptTerms}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
            </Box>
          </Box>
          <Box>
            <Button onPress={() => submit()}>
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
          </Box>
        </Stack>
      </Stack>
    </ScrollView>
  );
}
export default SignUpScreen;
