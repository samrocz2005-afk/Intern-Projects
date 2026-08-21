import {
  createSlice,
} from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const breadcrumbSlice = createSlice({
  name: "breadcrumbs",

  initialState,

  reducers: {
    setBreadcrumbs: (
      state,
      action
    ) => {
      state.items =
        action.payload || [];
    },

    /*
     * Add one breadcrumb.
     */
    addBreadcrumb: (
      state,
      action
    ) => {
      state.items.push(
        action.payload
      );
    },

    /*
     * Remove the last breadcrumb.
     */
    popBreadcrumb: (state) => {
      state.items.pop();
    },

    /*
     * Clear breadcrumbs.
     */
    clearBreadcrumbs: (state) => {
      state.items = [];
    },
  },
});

export const {
  setBreadcrumbs,
  addBreadcrumb,
  popBreadcrumb,
  clearBreadcrumbs,
} =
  breadcrumbSlice.actions;

export default breadcrumbSlice.reducer;