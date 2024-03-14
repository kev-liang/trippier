import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { store } from "../store/store"

interface GroupTitleInputProps {
  readOnly: boolean;
}

export interface MarkerGroup {
  markers: google.maps.places.PlaceResult[];
  styles: any;
  name: string;
  id: number;
  titleInputProps: GroupTitleInputProps;
}

interface MarkerSlice {
  groups: MarkerGroup[];
  selectedPlace: google.maps.places.PlaceResult | null;
}

const initialState: MarkerSlice = {
  groups: [
    {
      id: 0,
      name: "All",
      styles: {},
      markers: [],
      titleInputProps: { readOnly: true },
    },
  ],
  selectedPlace: null,
};

const findGroup = (
  groups: MarkerGroup[],
  groupId: number
): MarkerGroup | undefined => {
  return groups.find((group) => group.id === groupId);
};

const markerGroupSlice = createSlice({
  name: "marker",
  initialState,
  reducers: {
    setSelectedPlace: (state, action: PayloadAction<any>) => {
      state.selectedPlace = action.payload;
    },
    addSelectedMarker: (state, action: PayloadAction<any>) => {
      const groupId = action.payload;
      const marker = state.selectedPlace;
      if (!marker) return;
      const foundGroup = findGroup(state.groups, groupId);
      const allGroup = findGroup(state.groups, 0);
      if (!foundGroup || !allGroup) return;
      foundGroup.markers.push(marker);
      allGroup.markers.push(marker);
    },
    addGroup: (state) => {
      const newGroup: MarkerGroup= {
        id: state.groups.length,
        name: `Group ${state.groups.length + 1}`,
        markers: [],
        styles: {},
        titleInputProps: {readOnly: false}
      };
      state.groups.unshift(newGroup);
    },
    changeGroupName: (state, action) => {
      const { groupId, name } = action.payload;
      const foundGroup = findGroup(state.groups, groupId);
      if (!foundGroup) return;
      foundGroup.name = name;
    },
  },
});

export const {
  addSelectedMarker,
  addGroup,
  setSelectedPlace,
  changeGroupName,
} = markerGroupSlice.actions;
export default markerGroupSlice.reducer;
