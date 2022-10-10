import * as ImagePicker from "expo-image-picker";

export const pickImage = async () => {
      // no permissions request is necessary for launching the image library
      console.log("Pick image called")
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        return(result.uri);
      }
    };
