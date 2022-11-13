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
  Icon,
  DeleteIcon,
  CheckCircleIcon,
} from "native-base";
import patterns from "../assets/patterns.json";
import materials from "../assets/materials.json";
import colors from "../assets/colors.json";
const colorList = colors.list;
const colorCodes = colors.codes;
import Category from "../components/category";
import { addItem } from "../services/wardrobeService";

import ImageSelecter from "../utils/imageSelecter";
// import * as ImagePicker from "expo-image-picker";

function SizePicker(props) {
  const [measurement, setMeasurement] = React.useState("");
  var allSizes = {
    mens: {
      shirts: ["small", "medium", "large", "XL", "2XL", "3XL"],
    },
  };
  const sizes = allSizes.mens.shirts;
  return (
    <Select
      selectedValue={measurement}
      placeholder="Select Size"
      onValueChange={(itemValue) => setMeasurement(itemValue)}
    >
      {sizes.map((size) => (
        <Select.Item key={size} label={size} value={size} />
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

function ColorSelect(props) {
  const colorCategories = Object.keys(colorList);
  const [selectedColor, setSelectedColor] = useState(null);

  const [listOptions, setListOptions] = useState(colorCategories);

  const selectColor = (color) => {
    if (color == null) {
      setListOptions(colorCategories);
    } else {
      setListOptions(colorList[color]);
    }
    setSelectedColor(color);
  };

  return (
    <Select
      flex={1}
      key={props.rank}
      placeholder={"Select " + props.rank + " color"}
      onClose={() => {
        selectColor(null);
        props.setColor(null);
      }}
      defaultValue={props.value}
      onValueChange={(value) => {
        props.setColor(value);
      }}
      _stack={{
        divider: <Box bgColor={colorCodes[props.value]} p="5%" />,
      }}
      _item={{
        _stack: {
          alignItems: "center",
          justifyContent: "space-around",
        },
        _text: {
          paddingLeft: "4%",
          paddingY: "1%",
          color: "black",
          fontSize: "xl",
        },
        padding: 0,
      }}
      _actionSheetContent={{ padding: 0 }}
    >
      {listOptions.map((option) => {
        return selectedColor == null ? (
          <Select.Item
            key={option}
            label={option}
            value={option}
            onPress={() => {
              selectColor(option);
            }}
            bgColor={colorCodes[option]}
          />
        ) : (
          <Select.Item
            key={option}
            label={option}
            value={option}
            bgColor={colorCodes[option]}
          />
        );
      })}
    </Select>
  );
}

function ColorPickerSection(props) {
  const [length, setLength] = useState(1);

  const removeColor = (rank) => {
    console.log("remove " + rank);
    setLength(length - 1);
    props?.setColors({ ...props.colors, [rank]: null });
  };

  return (
    <VStack space={"1"} borderRadius="md">
      {["primary", "secondary", "tertiary"].map(
        (rank, index) =>
          index < length && (
            <HStack key={rank} space={"1%"} alignItems="center">
              <ColorSelect
                value={props.colors?.[rank]}
                setColor={(c) =>
                  props?.setColors({ ...props.colors, [rank]: c })
                }
                rank={rank}
              />
              {index == length - 1 && index > 0 && (
                <Button onPress={() => removeColor(rank)} bgColor="red.600">
                  <DeleteIcon color="white" />
                </Button>
              )}
            </HStack>
          )
      )}
      {length < 3 && (
        <Button onPress={() => setLength(length + 1)}>
          <Text>Add Color</Text>
        </Button>
      )}
    </VStack>
  );
}

// <Button
// onPress={() => {
//   addColor();
// }}
// flex="1"
// borderLeftRadius={0}
// >
// <AddIcon color="black" />
// </Button>

function NewItemScreen({ navigation }) {
  const [image, setImage] = useState(null);

  const [formData, setData] = useState({});

  const form = [
    {
      name: "Image",
      component: <ImageSelecter />,
    },
    {
      name: "Accessory",
      component: (
        <Checkbox
          accessibilityLabel="Accessory"
          onChange={(isSelected) =>
            setData({ ...formData, accessory: isSelected })
          }
        />
      ),
      isRequired: true,
      horizontal: true,
    },
    {
      name: "Category",
      component: (
        <Category
          accessory={formData.accessory}
          setCategory={(category) =>
            setData({ ...formData, category: category })
          }
        />
      ),
      isRequired: true,
    },
    {
      name: "Colors",
      component: (
        <ColorPickerSection
          colors={formData.colors}
          setColors={(color) => setData({ ...formData, colors: color })}
        />
      ),
      isRequired: true,
    },
    {
      name: "Pattern",
      component: (
        <Select
          onValueChange={(text) => setData({ ...formData, pattern: text })}
        >
          {patterns.map((pattern) => (
            <Select.Item
              key={pattern}
              label={pattern.charAt(0).toUpperCase() + pattern.slice(1)}
              value={pattern}
            />
          ))}
        </Select>
      ),
      isRequired: true,
    },
    {
      name: "Brand",
      component: (
        <Input onChangeText={(text) => setData({ ...formData, brand: text })} />
      ),
    },
    {
      name: "Material",
      component: (
        <Select
          onValueChange={(text) => setData({ ...formData, material: text })}
        >
          {materials.map((material) => (
            <Select.Item key={material} label={material} value={material} />
          ))}
        </Select>
      ),
    },
  ];

  const submit = async () => {
    var res = await addItem(formData);
    if (res == true) navigation.navigate("Wardrobe");
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

export default NewItemScreen;
