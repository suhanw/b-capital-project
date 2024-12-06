import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../";

interface IUiState {
  sideBarOpen: boolean;
}

const initialState: IUiState = {
  sideBarOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.sideBarOpen = !state.sideBarOpen;
    },
  },
});

export const { toggleSideBar } = uiSlice.actions;

export const uiReducer = uiSlice.reducer;

export const useToggleSideBar = () => {
  const sideBarOpen = useSelector((state: IRootState) => state.ui.sideBarOpen);
  const dispatch = useDispatch();
  return {
    sideBarOpen,
    toggleSideBar: () => dispatch(toggleSideBar()),
  };
};
