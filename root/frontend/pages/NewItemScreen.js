import React, { Component, useState, useEffect } from "react";
import {
  Button,
  Image,
  Box,
  HStack,
  VStack,
  Text,
  FormControl,
  Input,
  Checkbox,
  ScrollView,
  Select,
  Divider,
  AddIcon,
  Modal,
} from "native-base";
import ColorPicker from "react-native-wheel-color-picker";

import * as ImagePicker from "expo-image-picker";

//TODO Styling and get image picker/camera to work
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Image,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    this.setImage(result.uri);
  } else {
    return null;
  }
};

function SizePicker(props) {
  var allSizes = {
    mens: {
      shirts: ["small", "medium", "large", "XL", "2XL", "3XL"],
    },
  };
  const sizes = allSizes.mens.shirts;
  return (
    <Select>
      {sizes.map((size) => (
        <Select.Item label={size} />
      ))}
    </Select>
  );
}

function CatergoryPicker({ navigation }) {
  return (
    <Button onPress={() => navigation.navigate("CategoryList")}>
      <Text>CatergoryPicker</Text>
    </Button>
  );
}

function PatternPicker(props) {
  const patterns = ["No pattern", "Polka dots", "Stripes", "..."];
  return (
    <Select>
      {patterns.map((pattern) => (
        <Select.Item label={pattern} />
      ))}
    </Select>
  );
}

function ColorPickerSection(props) {
  const [showModal, setShowModal] = useState(false);
  const [currentModalColor, setCurrentModalColor] = useState({
    name: "primary",
  });
  const [primary, setPrimary] = useState({
    open: true,
    code: null,
    label: null,
  });
  const [secondary, setSecondary] = useState({
    open: false,
    code: null,
    label: null,
  });
  const [tertiary, setTertiary] = useState({
    open: false,
    code: null,
    label: null,
  });

  const [colors, setColors] = useState([primary, secondary, tertiary]);

  useEffect(() => {
    setColors([primary, secondary, tertiary]);
  }, [primary, secondary, tertiary]);

  function addColor() {
    var first = null;
    if (!secondary.open) {
      setSecondary({ open: true, code: "blue.400", label: "blue" });
      return;
    }
    if (!tertiary.open) {
      setTertiary({ open: true, code: "blue.400", label: "blue" });
      return;
    }
  }

  function removeColor(name) {
    if (name == "primary") return;
    if (name == "secondary") {
      if (tertiary.open) {
        setSecondary(tertiary);
        setTertiary({
          open: false,
          code: null,
          label: null,
        });
      } else {
        setSecondary({
          open: false,
          code: null,
          label: null,
        });
        setShowModal(false);
      }
    }
    if (name == "tertiary") {
      setTertiary({
        open: false,
        code: null,
        label: null,
      });
      setShowModal(false);
    }
  }

  function openColor(name) {
    setCurrentModalColor({ name: name });
    setShowModal(true);
  }

  function applyChanges() {
    if (currentModalColor.name == "primary")
      setPrimary({ ...primary, code: currentModalColor.code });
    if (currentModalColor.name == "secondary")
      setSecondary({ ...secondary, code: currentModalColor.code });
    if (currentModalColor.name == "tertiary")
      setTertiary({ ...tertiary, code: currentModalColor.code });
    setShowModal(false);
    return;
  }

  return (
    <Box borderRadius="md" borderWidth="1" borderColor="gray.300">
      <Modal isOpen={showModal}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton onPress={() => setShowModal(false)} />
          <Modal.Header>{currentModalColor.name}</Modal.Header>
          <Modal.Body>
            <ColorPicker
              onColorChangeComplete={(color) =>
                setCurrentModalColor({ ...currentModalColor, code: color })
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              {currentModalColor.name != "primary" && (
                <Button onPress={() => removeColor(currentModalColor)}>
                  Remove
                </Button>
              )}
              <Button onPress={() => applyChanges()}>Apply</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <HStack alignItems="center">
        <Button
          onPress={() => openColor("primary")}
          flex="10"
          borderRightRadius={secondary.open ? 0 : "md"}
          borderLeftRadius={"xl"}
          bgColor={primary.code != null ? primary.code : "blue.400"}
        >
          <Text>Primary</Text>
        </Button>
        {secondary.open && (
          <Button
            onPress={() => openColor("secondary")}
            flex="10"
            borderRightRadius={tertiary.open ? 0 : "md"}
            borderLeftRadius={0}
            bgColor={secondary.code != null ? secondary.code : "blue.400"}
          >
            <Text>Secondary</Text>
          </Button>
        )}
        {tertiary.open && (
          <Button
            onPress={() => openColor("tertiary")}
            flex="10"
            borderRightRadius={"xl"}
            borderLeftRadius={0}
            bgColor={tertiary.code != null ? tertiary.code : "blue.400"}
          >
            <Text>Tertiary</Text>
          </Button>
        )}
        <Button
          onPress={() => {
            addColor();
          }}
          flex="1"
          borderLeftRadius={0}
        >
          <AddIcon color="black" />
        </Button>
      </HStack>
    </Box>
  );
}

function NewItemScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const form = [
    {
      name: "Accessory",
      component: <Checkbox />,
      isRequired: true,
      horizontal: true,
    },
    {
      name: "Colors",
      component: <ColorPickerSection />,
    },
    {
      name: "Pattern",
      component: <PatternPicker />,
    },
    {
      name: "Category",
      component: <CatergoryPicker navigation={navigation} />,
    },
    {
      name: "Slot",
      component: <Input />,
    },
    {
      name: "Brand",
      component: <Input />,
    },
    {
      name: "Material",
      component: <Input />,
    },
    {
      name: "Size",
      component: <SizePicker />,
    },
  ];
  return (
    <ScrollView>
      <VStack mx="3" paddingTop={3} paddingBottom={7}>
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
      </VStack>
    </ScrollView>
  );
}

export default NewItemScreen;
