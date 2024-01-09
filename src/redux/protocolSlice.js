import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import protocolDefinition from "./dinvoice-protocol.json";
import { toastError } from "../utils/toast";

export const checkProtocol = createAsyncThunk(
  "protocol/checkProtocol",
  async (arg, thunkAPI) => {
    const store = thunkAPI.getState();
    const web5 = store.did.web5;
    if (!web5) {
      return;
    }
    const { protocols, status } = await web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: protocolDefinition.protocol,
        },
      },
    });
    if (status.code !== 200) {
      throw new Error("Error querying protocols:" + JSON.stringify(status));
    }
    if (protocols.length > 0) {
      return;
    }
    console.log("Protocol not exists");
    const { status: configureStatus, protocol } =
      await web5.dwn.protocols.configure({
        message: {
          definition: protocolDefinition,
        },
      });

    console.log("Protocol configured", configureStatus, protocol);

    // configuring protocol on remote DWN
    const { status: configureRemoteStatus } = await protocol.send(
      store.did.did
    );
    console.log("Protocol configured on remote DWN", configureRemoteStatus);
  }
);

export const protocolSlice = createSlice({
  name: "protocol",
  initialState: {
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkProtocol.rejected, (state, action) => {
      state.isError = true;
      console.error(action.error);
      toastError("Error while checking protocol status!");
    });
  },
});

export default protocolSlice.reducer;
