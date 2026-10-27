import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
};

export const sectorSlice = createSlice({
  name: "sectorSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get sectors
export const getSectors = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    // showAlert({
    //   status: 404,
    //   statusText: error?.response?.data?.error || "Something went wrong. ",
    // });
    console.error("In get sectors error", error);
  } finally {
    dispatch(setLoading(false));
  }
};


export const { setLoading, postSuccess } = sectorSlice.actions;
export default sectorSlice.reducer;
