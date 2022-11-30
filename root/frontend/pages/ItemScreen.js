import React, { Component, useState, useEffect } from "react";
import {
  Button,
  HStack,
  VStack,
  FormControl,
  Input,
  ScrollView,
  Select,
  DeleteIcon,
  Spinner,
  useToast,
} from "native-base";
import patterns from "../assets/patterns.json";
import materials from "../assets/materials.json";
import { addItem, editItem } from "../services/wardrobeService";

import ImageSelecter from "../utils/imageSelecter";
import capitalize from "../utils/capitalize";
// import * as ImagePicker from "expo-image-picker";
import ToastAlert from "../components/ToastAlert";
import CategoryPicker from "../components/CategoryPicker";
import ColorPicker from "../components/ColorPicker";

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

function ColorPickerSection(props) {
  const num_colors = props.colors ? Object.keys(props.colors)?.length : 1;
  const [length, setLength] = useState(num_colors);
  const removeColor = (rank) => {
    setLength(length - 1);
    props?.setColors({ ...props.colors, [rank]: null });
  };

  return (
    <VStack space={"1"} borderRadius="md">
      {["primary", "secondary", "tertiary"].map(
        (rank, index) =>
          index < length && (
            <HStack key={rank} space={"1%"} alignItems="center">
              <ColorPicker
                color={props.colors?.[rank]}
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
          {"Add" + (length == 1 ? " Secondary" : " Tertiary") + " Color"}
        </Button>
      )}
    </VStack>
  );
}

function ItemScreen({ navigation, route }) {
  const toast = useToast();

  const editing = route?.params?.item != undefined;
  const [submitting, setSubmitting] = useState(false);
  const [formData, setData] = useState(
    editing ? { ...route.params.item } : { type: route.params.type }
  );
  const form = [
    {
      name: "Category",
      component: (
        <CategoryPicker
          type={formData["type"]}
          category={formData["category"]}
          setCategory={(category) =>
            setData({ ...formData, category: category })
          }
          subcategories={formData["subcategories"]}
          setSubcategories={(subcategories) =>
            setData({ ...formData, subcategories: subcategories })
          }
        />
      ),
      isRequired: true,
    },
    {
      name: "Material",
      component: (
        <Select
          defaultValue={formData["material"]}
          onValueChange={(text) => setData({ ...formData, material: text })}
          placeholder={"Select material"}
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
          colors={formData["colors"]}
          setColors={(color) => setData({ ...formData, colors: color })}
        />
      ),
      isRequired: true,
    },
    {
      name: "Pattern",
      component: (
        <Select
          defaultValue={formData["pattern"]}
          onValueChange={(text) => setData({ ...formData, pattern: text })}
          placeholder={"Select pattern"}
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
        <Input
          defaultValue={formData["brand"]}
          onChangeText={(text) => setData({ ...formData, brand: text })}
          placeholder={"Brand"}
        />
      ),
    },
  ];

  const finish = async () => {
    setSubmitting(true);
    var res = editing
      ? await editItem(formData, route.params.item._id)
      : await addItem(formData);
    setSubmitting(false);
    toast.show({
      render: () => {
        return (
          <ToastAlert
            status={res === true ? "success" : "error"}
            colorScheme={res === true ? "success" : "error"}
            title={
              res === true
                ? "Item successfully " + (editing ? "updated" : "created") + "!"
                : "Failed to " +
                  (editing ? "update" : "create") +
                  " item, please try again."
            }
          />
        );
      },
    });
    if (res == true) {
      navigation.navigate("Wardrobe");
    }
  };

  // takes in route from wardrobe screen and reads type and sets title
  useEffect(() => {
    if (editing) {
      navigation.setOptions({
        headerTitle: "Editing " + capitalize(route.params.item.type),
      });
    } else if (route?.params?.type) {
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
      <ImageSelecter
        image={formData?.image}
        setImage={(image) => setData({ ...formData, image: image })}
      />
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
        <Button leftIcon={submitting && <Spinner />} onPress={() => finish()}>
          Submit
        </Button>
      </VStack>
    </ScrollView>
  );
}

export default ItemScreen;
