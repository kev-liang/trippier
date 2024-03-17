import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RgbColor } from "react-colorful";
import { Constants } from "../utils/constants";
import { findGroup } from "../domain/groups";

interface GroupTitleInputProps {
  readOnly: boolean;
}

export interface Marker extends google.maps.places.PlaceResult {
  groupId: number;
}
export interface MarkerGroup {
  markers: Marker[];
  styles: any;
  name: string;
  id: number;
  titleInputProps: GroupTitleInputProps;
  color: RgbColor;
  secondaryColor: RgbColor;
}

export interface MarkerSlice {
  groups: MarkerGroup[];
  allGroup: MarkerGroup;
  selectedPlace: google.maps.places.PlaceResult | null;
  selectedGroup: number;
}

const getEmptyGroup = () => {
  return {
    id: Constants.DEFAULT_MARKER_GROUP_ID,
    name: "All",
    styles: {},
    markers: [],
    titleInputProps: { readOnly: true },
    color: { r: 0, g: 0, b: 0 },
    secondaryColor: { r: 255, g: 255, b: 255 },
  };
};

const initialState: MarkerSlice = {
  // initial "All" group id start 0
  groups: [],
  allGroup: getEmptyGroup(),
  selectedPlace: null,
  selectedGroup: -1,
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
    setGroupColor: (state, action: PayloadAction<any>) => {
      const { groupId, color, secondaryColor } = action.payload;
      const foundGroup = findGroup(state.groups, groupId);
      if (!foundGroup) return;
      foundGroup.color = color;
      foundGroup.secondaryColor = secondaryColor;
    },
    addSelectedMarker: (state) => {
      const { selectedPlace } = state
      if (!selectedPlace) return;
      const marker = {...selectedPlace, groupId: state.selectedGroup } 
      state.allGroup.markers.push(marker);
      const foundGroup = findGroup(state.groups, state.selectedGroup);
      if (!foundGroup) return;
      foundGroup.markers.push(marker);
    },
    addGroup: (state) => {
      const newGroup: MarkerGroup = getEmptyGroup();
      newGroup.id = state.groups.length;
      newGroup.name = `Group ${state.groups.length + 1}`;
      newGroup.titleInputProps = { readOnly: false };
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
  setGroupColor,
} = markerGroupSlice.actions;
export default markerGroupSlice.reducer;
