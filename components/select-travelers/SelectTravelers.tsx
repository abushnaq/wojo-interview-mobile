import { Dispatch, SetStateAction } from "react";
import { Select } from "@/ui";
import { Text, TextInput } from "react-native";

export type SelectTravelersProps = {
    nbTravelers: number;
    setNbTravelers: Dispatch<SetStateAction<number>>;
};
export const SelectTravelers: React.FC<SelectTravelersProps> = ({ nbTravelers, setNbTravelers }) => {
    return (
        <>
            <Text> How many travelels? </Text>
            <TextInput value={nbTravelers}
            onChangeText={setNbTravelers}
            placeholder="number"
            />
    </>
    );
};
