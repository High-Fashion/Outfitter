import OutfitCard from "../components/OutfitCard";
import { useAuth } from "../contexts/Auth";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, VStack } from "native-base";



function SimilarOutfitScreen({navigation, route}){
    const { user } = useAuth();
    const [outfits, setOutfits] = useState(user.wardrobe.outfits);
    
    return (
    
        <View>
          {outfits.map((outfit) => {
            return (<View flex={1}>
            <OutfitCard key={outfit._id} outfit={outfit} />
            </View>)
          })}
        </View>
    );

}

export default SimilarOutfitScreen;