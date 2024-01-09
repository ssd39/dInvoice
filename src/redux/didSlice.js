import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Web5 } from "@web5/api";
import { toastError, toastSucess } from "../utils/toast";

export const connect = createAsyncThunk("did/connect", async () => {
  const { web5, did } = await Web5.connect({
    sync: '5s',
  });
  return { web5, did };
});

export const didSlice = createSlice({
  name: "did",
  initialState: {
    isError: null,
    web5: null,
    did: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(connect.fulfilled, (state, action) => {
      console.log(action.payload.did)
      state.did = action.payload.did;
      state.web5 = action.payload.web5;
      toastSucess("Connected to Web5 successfully!")
    });
    builder.addCase(connect.rejected, (state, action) => {
      state.isError = true;
      console.error(action.error);
      toastError("Error while connecting to Web5")
    });
  },
});

export default didSlice.reducer;
