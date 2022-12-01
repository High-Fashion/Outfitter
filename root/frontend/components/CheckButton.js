import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function CheckButton({handlePress}) {
    return (
    // <TouchableOpacity>
    <TouchableOpacity onPress={handlePress}>
       <Ionicons name="checkmark" color="green" size={30}/>
    </TouchableOpacity>    
    )
}