import pluralize from "pluralize";
import { StyleSheet, Text, View } from "react-native";
import { RadioGroup } from "@/ui";
import { useRooms } from "@/hooks";
import { Room } from "@/app/rooming+api";

type Combination = {
    S?: number;
    D?: number;
    F?: number;
    Q?: number;
};
type Config = Combination[][];

export const roomCapacities = [1, 2, 3, 4]

export type RoomingListProps = {
    nbTravelers: number;
    selectedId?: string;
    setSelection: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export function processCombination(combination:number[]) : Combination[] {
    const roomCombosDictionary : { [key : number] : Combination} = {}

    for (let index = 0; index < combination.length; index++) {
        let currentCount = roomCombosDictionary[combination[index]]

        switch (combination[index]) {
            case 1:
                if (currentCount === undefined)
                {
                    currentCount = {}
                    currentCount.S = 1    
                    roomCombosDictionary[combination[index]] = currentCount
                    break
                } else 
                {
                    currentCount.S += 1
                }
                break;
            case 2:
                
                if (currentCount === undefined)
                {
                    currentCount = {}
                    currentCount.D = 1    
                    roomCombosDictionary[combination[index]] = currentCount
                    break
                }
                else
                {
                    currentCount.D += 1
                }
                break;
            case 3:
                if (currentCount === undefined)
                {
                    currentCount = {}
                    currentCount.F = 1    
                    roomCombosDictionary[combination[index]] = currentCount
                    break
                }
                else
                {
                    currentCount.F += 1
                }
                break;
            case 4:
                if (currentCount === undefined)
                {
                    currentCount = {}
                    currentCount.Q = 1    
                    roomCombosDictionary[combination[index]] = currentCount
                    break
                }
                else
                {
                    currentCount.Q += 1
                }
                break;
            default:
                break;
        }
    }

    let values = Object.values(roomCombosDictionary)
    let combo : Combination = {};

    for (let value of values)
    {
        populateComboWithValue(value, combo);  
    }
    
    return [combo]    
}

function populateComboWithValue(value: Combination, combo: Combination) {
    if (value.D !== undefined) {
        combo.D = value.D;
    }
    if (value.F !== undefined) {
        combo.F = value.F;
    }
    if (value.S !== undefined) {
        combo.S = value.S;
    }
    if (value.Q !== undefined) {
        combo.Q = value.Q;
    }
}

export function calculateRoomCombinations(candidates: number[], target: number) : Combination[] {
    let result : Combination[] = []

    let combination : number[] = []
    
    function backtrack(remainingTarget: number, startIndex: number) {
        
        if (remainingTarget == 0) {
            // no more people to house, so our combination is complete
            let roomCombination = processCombination(combination)
            result = result.concat(roomCombination)
            return
        }
        
        // Iterate through the candidates starting from startIndex
        for (let i = startIndex; i < candidates.length; i++) {
            const currentNumber = candidates[i];
            
            // If the current number exceeds the remaining target, break the loop
            if (currentNumber > remainingTarget) {
                break
            }
            
            // Choose the current number
            combination.push(currentNumber)
            
            backtrack(remainingTarget - currentNumber, i)
            combination.pop()
        }
    }
    
    backtrack(target, 0)
    return result
}

export const RoomingList: React.FC<RoomingListProps> = ({ nbTravelers, selectedId, setSelection }) => {
    const { rooms, loading } = useRooms();
    if (loading) {
        return <Text>Loading...</Text>;
    }
    if (!rooms) {
        return <Text>{`There are no rooms for ${nbTravelers} ${pluralize("traveler", nbTravelers)}`}</Text>;
    }  

    const roomCombinations = calculateRoomCombinations(roomCapacities, nbTravelers)  

    const combos : Config = 
            roomCombinations?.map((combination) =>
                Object.entries(combination).reduce<{ count: number; room: Room }[]>((prev, [curr, count]) => {
                    const room = rooms?.find((room: Room) => room.sku === curr);
                    return room ? [...prev, { count, room }] : prev;
                }, [])
            ) ?? [];

    const items = combos.map((combos) => {
        const combination = combos.reduce((prev, curr) => {
            return `${prev ? `${prev}, ` : ""}${curr.count} ${curr.room.name} ${pluralize("room", curr.count)}`;
        }, "");
        return { id: combination, label: combination, value: combination };
    });
    if (!nbTravelers) {
        return <View testID="rooming-list" style={styles.container}/>
    }
    return (
        <View testID="rooming-list" style={styles.container}>
            <RadioGroup items={items} selectedId={selectedId} onChange={setSelection} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
});
