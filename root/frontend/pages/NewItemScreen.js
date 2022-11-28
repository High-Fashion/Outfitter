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
  View,
  ChevronDownIcon,
  ArrowBackIcon,
  Heading,
} from "native-base";
import patterns from "../assets/patterns.json";
import materials from "../assets/materials.json";
import colors from "../assets/colors.json";
const colorList = colors.list;
const colorCodes = colors.codes;
import Category from "../components/category";
import { addItem } from "../services/wardrobeService";

import ImageSelecter from "../utils/imageSelecter";
import capitalize from "../utils/capitalize";
import { useAuth } from "../contexts/Auth";

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

function getCategories(type, gender) {
  console.log(type, gender);
  var categories = require("../assets/categories.json");
  var newCategories = {};
  gender.map((gender) => {
    newCategories = { ...newCategories, ...categories[type][gender] };
  });
  return newCategories;
}

function CategoryPicker(props) {
  const { user } = useAuth();

  const categories = getCategories(props.type, user.wardrobe.gender);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [listOptions, setListOptions] = useState(Object.keys(categories));

  const selectCategory = (category) => {
    if (category == null) {
      setListOptions(Object.keys(categories));
    } else {
      console.log("selected", category);
      setListOptions(Object.keys(categories[category]));
    }
    setSelectedCategory(category);
  };

  return (
    <Select
      flex={1}
      key={props.rank}
      placeholder={"Select " + props.type + " type"}
      onClose={() => {
        selectCategory(null);
        props.setCategory(null);
      }}
      defaultValue={props.value}
      onValueChange={(value) => {
        props.setCategory(value);
      }}
      _item={{
        _stack: {
          alignItems: "center",
          justifyContent: "space-around",
        },
        _text: {
          color: "black",
          padding: 1,
          fontSize: "xl",
        },
        padding: 0,
      }}
      _actionSheetBody={{
        ListHeaderComponent: selectedCategory != null && (
          <View
            mx="3"
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
              padding: 5,
            }}
          >
            <View
              style={{
                zIndex: 5,
                position: "absolute",
                overflow: "visible",
                left: 0,
              }}
            >
              <Button
                p={2}
                variant="ghost"
                borderRadius="full"
                onPress={() => selectCategory(null)}
              >
                <ArrowBackIcon size="lg" />
              </Button>
            </View>
            <Heading
              style={{
                textAlign: "center",
                textAlignVertical: "center",
                position: "relative",
              }}
            >
              {capitalize(selectedCategory, true)}
            </Heading>
          </View>
        ),
        paddingTop: 1,
      }}
    >
      {listOptions.map((option) => {
        return selectedCategory == null ? (
          <Select.Item
            key={option}
            label={capitalize(option, true)}
            value={option}
            onPress={() => {
              selectCategory(option);
            }}
          />
        ) : (
          <Select.Item
            key={option}
            label={capitalize(option, true)}
            value={option}
          />
        );
      })}
    </Select>
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
        <Button onPress={() => setLength(length + 1)}>Add Color</Button>
      )}
    </VStack>
  );
}

function NewItemScreen({ navigation, route }) {
  
  const [formData, setData] = useState({});
  const [image, setImage] = useState(null);
//TODO on setData for image mime, type and filename?
// STORE IMAGE ID in item

  const selectedImage = (image) => {
    setData({ ...formData, image: image })
    // console.log("SET DATA TO: ", image);
  }

  const form = [
    {
      name: "Category",
      component: (
        <CategoryPicker
          type={route.params.type}
          setCategory={(category) =>
            setData({ ...formData, category: category })
          }
        />
      ),
      isRequired: true,
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
  ];

  const submit = async () => {
    // console.log("Click submit image is: ", image);
    // console.log("\n\nIN SUBMIT FORM DATA IS: ", formdata);
    var res = await addItem(formData);
    if (res == true) navigation.navigate("Wardrobe");
  };


  const testImage = () => {
    console.log(image);
  }

  useEffect(() => {
    if (route?.params?.type) {
      navigation.setOptions({
        headerTitle:
          "New " +
          (route.params.type == "clothing"
            ? "Clothing Item"
            : capitalize(route.params.type)),
      });
    }
  }, [route]);
  return (
    <ScrollView>
      <ImageSelecter selectedImage={selectedImage} />
      <VStack mx={5} space={2} paddingBottom={7}>
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
        <Button onPress={() => submit()}>Submit</Button>
        <Button onPress={() => testImage()}>Print Image</Button>
      </VStack>
    </ScrollView>
  );
}

export default NewItemScreen;
