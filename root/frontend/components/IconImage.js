import { Image, View, VStack } from "native-base";

import { getImage } from "../services/wardrobeService";
import { useEffect, useState } from "react";
import colors from "../assets/colors.json";
const colorCodes = colors["codes"];

const getIcon = (category, subcategories) => {
  switch (category) {
    case "skirts":
      return require("../assets/clothing_icons/pleated_skirt_outline.png");
    case "heels":
      return require("../assets/clothing_icons/heels_outline.png");
    case "pants":
    case "jeans":
      return require("../assets/clothing_icons/jeans_outline.png");
    case "shirts":
      return require("../assets/clothing_icons/polo_outline.png");
    case "hoodies":
      return require("../assets/clothing_icons/hoodie_outline.png");
    case "sweaters":
      return require("../assets/clothing_icons/sweater_outline.png");
    case "shorts":
      return require("../assets/clothing_icons/shorts_outline.png");
    case "coats & jackets":
      switch (subcategories) {
        case subcategories.contains("peacoat"):
          return require("../assets/clothing_icons/coat_outline.png");
        case subcategories.contains("puffer"):
          return require("../assets/clothing_icons/puffy_jacket_outline.png");
        default:
          return require("../assets/clothing_icons/pocket_jacket_outline.png");
      }
    case "suits":
    case "blazers & sport coats":
      return require("../assets/clothing_icons/suit_jacket_outline.png");
    case "dresses":
      return require("../assets/clothing_icons/dress_outline.png");
    case "tops":
      return require("../assets/clothing_icons/bralette_outline.png");
    case "hats":
      return require("../assets/clothing_icons/hat_outline.png");
    case "glasses":
      return require("../assets/clothing_icons/glasses_outline.png");
    case "boots":
    case "flats":
    case "sandals":
    case "sneakers":
      return require("../assets/clothing_icons/sneaker_outline.png");
    case "jewelry":
      switch (subcategories) {
        default:
        case subcategories.contains("watch"):
          return require("../assets/clothing_icons/watch_outline.png");
      }
    case "swimwear":
    case "belts":
    case "formal":
    case "bags":
    case "other":
    case "hair":
    default:
      return "";
  }
};

export default function IconImage(props) {
  return (
    <Image
      resizeMode="contain"
      tintColor={
        colors.list.White.includes(props.item.colors.primary)
          ? "black"
          : colorCodes[props.item.colors.primary]
      }
      alt="image missing"
      source={getIcon(props.item.category, props.item.subcategories)}
    />
  );
}
