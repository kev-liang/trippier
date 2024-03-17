import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { MarkerGroup } from "../store/markerGroupSlice";
import {
  addGroup,
  setGroupColor,
  changeGroupName,
} from "../store/markerGroupSlice";
import MarkerGroupRow from "./MarkerGroupRow";

import { Box, TextField } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import MarkerInputSection from "./MarkerInputSection";
import ColorPicker from "./ux/ColorPicker";
import { RgbColor } from "react-colorful";
import GroupColorIcon from "./ux/GroupColorIcon";

const MarkerGroupComponent = () => {
  const allGroups: MarkerGroup[] = useSelector((state: RootState) => [
    ...state.markerGroup.groups,
    state.markerGroup.allGroup,
  ]);
  const dispatch = useDispatch();

  const handleAddGroup = () => {
    dispatch(addGroup());
  };

  const handleGroupNameChanged = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    groupId: number
  ) => {
    dispatch(changeGroupName({ groupId, name: e.target.value }));
  };

  const handleColorPicked = (
    groupId: number,
    color: RgbColor,
    secondaryColor: RgbColor
  ) => {
    dispatch(setGroupColor({ groupId, color, secondaryColor }));
  };

  return (
    <div>
      {allGroups.map((group) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleGroupNameChanged(e, group.id)}
                  value={group.name}
                  variant="standard"
                  InputProps={group.titleInputProps}
                />
                <GroupColorIcon groupId={group.id} />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {group.markers.map((marker: any) => {
                return <MarkerGroupRow marker={marker} />;
              })}
              <ColorPicker
                handleColorPicked={(
                  color: RgbColor,
                  secondaryColor: RgbColor
                ) => handleColorPicked(group.id, color, secondaryColor)}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
      <div onClick={handleAddGroup}> ADD GROUP</div>
      <MarkerInputSection />
    </div>
  );
};

export default MarkerGroupComponent;
