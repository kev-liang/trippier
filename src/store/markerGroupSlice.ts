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
  selectedGroup: number;
}

const initialState: MarkerSlice = {
  // initial "All" group id start 0
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
  selectedGroup: -1,
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
    setSelectedGroup: (state, action: PayloadAction<any>) => {
      state.selectedGroup = action.payload;
    },
    addSelectedMarker: (state) => {
      const marker = state.selectedPlace;
      if (!marker) return;
      const allGroup = findGroup(state.groups, 0);
      if (!allGroup) return;
      allGroup.markers.push(marker);
      if (state.selectedGroup < 0) return;
      const foundGroup = findGroup(state.groups, state.selectedGroup);
      if (!foundGroup) return;
      foundGroup.markers.push(marker);
    },
    addGroup: (state) => {
      const newGroup: MarkerGroup = {
        id: state.groups.length,
        name: `Group ${state.groups.length}`,
        markers: [],
        styles: {},
        titleInputProps: { readOnly: false },
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
  setSelectedGroup,
} = markerGroupSlice.actions;
export default markerGroupSlice.reducer;
