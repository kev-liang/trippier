import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { MarkerGroup } from "../store/markerGroupSlice";
import { addGroup, changeGroupName } from "../store/markerGroupSlice";
import MarkerGroupRow from "./MarkerGroupRow";

import { TextField } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import MarkerInputSection from "./MarkerInputSection";
import { HexColorPicker } from "react-colorful";

const MarkerGroupComponent = (props: any) => {
  const groups = useSelector((state: RootState) => state.markerGroup.groups);
  const dispatch = useDispatch();
  const [colorVal, setColorVal] = useState<string>();
  
  const handleAddGroup = () => {
    dispatch(addGroup());
  };

  const handleGroupNameChanged = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    group: MarkerGroup
  ) => {
    const action = {
      payload: { groupId: group.id, name: e.target.value },
    };
    dispatch(changeGroupName(action));
  };

  const handleColorChange = (color: string) => {
    setColorVal(color)
  }

  return (
    <div>
      {groups.map((group: any) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <TextField
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleGroupNameChanged(e, group)}
                label={group.name}
                variant="standard"
                InputProps={group.titleInputProps}
              />
            </AccordionSummary>
            <AccordionDetails>
              {group.markers.map((marker: any) => {
                return <MarkerGroupRow marker={marker} />;
              })}
              <HexColorPicker color={colorVal} onChange={setColorVal}/>
              {colorVal}
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
