import React, { Component, useState, useEffect } from "react";
import {
  Button,
  VStack,
  Text,
  FormControl,
  Input,
  Checkbox,
  ScrollView,
  Select,
  Fab,
} from "native-base";

import ImageSelecter from "../utils/imageSelecter";

function NewOutfitScreen({ navigation }) {
  const [image, setImage] = useState(null);

  const [formData, setData] = useState({});

  const form = [
    {
      name: "Image",
      component: <ImageSelecter />,
    },
  ];

  const addItem = () => {};

  const submit = async () => {
    var res = await addItem(formData);
    if (res == true) navigation.navigate("Outfits");
  };

  return (
    <ScrollView>
      <VStack mx="3" space={2} paddingTop={3} paddingBottom={7}>
        {form.map((field) => {
          if (field.horizontal)
            return (
              <FormControl key={field.name} isRequired={field.isRequired}>
                <HStack alignItems="center" justifyContent="space-between">
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}
                  >
                    {field.name}
                  </FormControl.Label>
                  {field.component}
                </HStack>
              </FormControl>
            );
          else
            return (
              <FormControl key={field.name} isRequired={field.isRequired}>
                <FormControl.Label
                  _text={{
                    bold: true,
                  }}
                >
                  {field.name}
                </FormControl.Label>
                {field.component}
              </FormControl>
            );
        })}
        <Button onPress={() => submit()}>
          <Text>Submit</Text>
        </Button>
      </VStack>
    </ScrollView>
  );
}

export default NewOutfitScreen;
