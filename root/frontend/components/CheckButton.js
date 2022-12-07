import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function CheckButton({ handlePress }) {
  return (
    <TouchableOpacity onPress={handlePress}>
      <Ionicons name="checkmark" color="green" size={30} />
    </TouchableOpacity>
  );
}
