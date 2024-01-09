import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import protocolDefinition from "./dinvoice-protocol.json";
import toast, { toastError, toastSucess } from "../utils/toast";
import { TbdexHttpClient } from "@tbdex/http-client";

export const getBestOffer = createAsyncThunk(
  "pfi/getBestOffer",
  async (arg, thunkAPI) => {
    const store = thunkAPI.getState();
    const web5 = store.did.web5;
    if (!web5) {
      return [];
    }
    const did = store.did.did;
    toast("Fetching the best offer for given pair using tbDEX")
    const pfis = await TbdexHttpClient.discoverPFIs();
    const offers = [];
    for (let pfi of pfis) {
      try {
        const { data: offerings } = await TbdexHttpClient.getOfferings({
          pfiDid: pfi.did,
          filter: {
            payinCurrency: arg.payinCurrency,
            payoutCurrency: arg.payoutCurrency,
          },
        });
        if (offerings.length > 0) {
          offers.concat(offerings);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (offers.length > 0) {
      const bestOffer = offers.reduce(
        (lastBest, cur) =>
          cur.payoutUnitsPerPayinUnit < lastBest.payoutUnitsPerPayinUnit
            ? cur
            : lastBest,
        offers[0]
      );
      toastSucess("Best offer fetched")
      return bestOffer;
    } else {
      toastError("No PFIs found for given pair!");
    }
  }
);

export const pifSlice = createSlice({
  name: "pfi",
  initialState: {
    offer: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBestOffer.rejected, (state, action) => {
      console.error("pfi discocery error", action.error);
      toastError(action.error.message);
    });
    builder.addCase(getBestOffer.fulfilled, (state, action) => {
      state.offer = action.payload;
    });
  },
});

export default pifSlice.reducer;
