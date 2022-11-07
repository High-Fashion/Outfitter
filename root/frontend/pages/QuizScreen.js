/*https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/usage*/
/*https://snack.expo.dev/@mali_ai/react-native-dropdown-picker*/
import { useAuth } from "../contexts/Auth";
import { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
} from "native-base";
import {useForm, Controller} from 'react-hook-form';

import DropDownPicker from 'react-native-dropdown-picker';

function QuizScreen({route}) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([
      {label: 'Emo', value: 'emo'},
      {label: 'Goth', value: 'goth', parent: 'emo'},

      {label: 'Urban', value: 'urban'},
      {label: 'Hipster', value: 'hipster', parent: 'urban'},
      {label: 'Vintage', value: 'vintage', parent: 'urban'},
    ]);
    const { user } = useAuth();
    const { handleSubmit, control } = useForm();
    const onSubmit = (data) => {
      console.log(data, "data");
    };

    return (
      <View>{user.firstName && <Text>{ user.firstName}, Check out our style quiz</Text>} 
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15
      }}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          multiple={true}
          min={0}
          max={3}
          mode="BADGE"
          placeholder="Select Style"
        />
      </View>
      </View>
    );
}

export default QuizScreen;
