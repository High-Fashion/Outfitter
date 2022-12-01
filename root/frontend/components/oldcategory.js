import React, { useState } from "react";
import { Select, Box } from "native-base";

function Category() {
    const [Data, setData] = useState(Object.keys(require("../assets/male-categories.json")["mens"]))
    const [SecondData, setSecondData] = ""

    return (
        <Box>
            {/* This is a box */}
            {/* <Select onValueChange={() => setSecondData = DATA[value]} placeholder="Select Item Type"> */}
            <Select placeholder="Select Item Type" onValueChange= { () => setSecondData(Data[value])}>
            {Data.map((category) =>  
                <Select.Item label={category} value={category} />
             )} 
            </Select> 
            <Select>
                {SecondData.map((category) =>
                    <Select.Item label={category} />
                )}
            </Select>
        </Box>
    )
}

export default Category;