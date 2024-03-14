import { configureStore } from "@reduxjs/toolkit";
import markerGroup from "./markerGroupSlice";

export const store = configureStore({
  reducer: {
    markerGroup,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
