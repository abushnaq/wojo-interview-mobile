import { render, waitFor } from "@testing-library/react-native";
import { calculateRoomCombinations, processCombination, RoomingList } from "../RoomingList";

jest.mock("@/hooks", () => ({
    useRooms: jest.fn(() => ({
        rooms: [],
        loading: false,
    })),
}));

it("Renders the component.", async () => {
    const component = render(<RoomingList nbTravelers={0} setSelection={jest.fn()} />);
    await waitFor(() => expect(component.getByTestId("rooming-list")).toBeTruthy());
});

export const roomCapacities = [1, 2, 3, 4]
it("calculate correct room combinations.", async () => {

    let value0 = calculateRoomCombinations(roomCapacities, 0)
    let value1 = calculateRoomCombinations(roomCapacities, 1)
    let value3 = calculateRoomCombinations(roomCapacities, 3)

    expect(value0[0]).toEqual({})


    expect(value1[0].S === 1).toBe(true)

    expect(value3[0].S === 3).toBe(true)

    expect(value3[1].S === 1).toBe(true)
    expect(value3[1].D === 1).toBe(true)
    expect(value3[2].F === 1).toBe(true)
});

// this test is not necessarily needed but provides better visibility in case of refactor
it("assign combination correctly from number array.", async () => {
    let value0 = processCombination([])
    let value1 = processCombination([1])
    let value3 = processCombination([3])

    expect(value0.S).toBeUndefined()
    expect(value1.S).toEqual(1)
    expect(value3.F).toEqual(1)
});
