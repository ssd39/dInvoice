import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import protocolDefinition from "./dinvoice-protocol.json";
import { toastError, toastSucess } from "../utils/toast";

export const sendInvoice = createAsyncThunk(
  "invoice/sendInvoice",
  async (data, thunkAPI) => {
    const store = thunkAPI.getState();
    const web5 = store.did.web5;
    if (!web5) {
      return [];
    }
    const did = store.did.did;
    data.billTo = data.billTo.trim();
    const recipientDID = data.billTo;
    delete data["isSending"];
    data["author"] = did;
    data["recipient"] = recipientDID;
    data["@type"] = "invoice";
    const { record } = await web5.dwn.records.create({
      data,
      message: {
        protocol: protocolDefinition.protocol,
        protocolPath: "invoice",
        schema: protocolDefinition.types.invoice.schema,
        dataFormat: protocolDefinition.types.invoice.dataFormats[0],
        recipient: recipientDID,
      },
    });
    /*const { status: remoteSendStatus } = await record.send(did);

    if (remoteSendStatus.code !== 202) {
      console.error(remoteSendStatus);
      throw new Error("Error while storing to remote dwn");
    }*/

    const { status: recipientSendStatus } = await record.send(recipientDID);
    if (recipientSendStatus.code !== 202) {
      console.error(recipientSendStatus);
      throw new Error("Error while storing to recipient dwn");
    }
    console.log("recipientSendStatus:", recipientSendStatus);
    return record;
  }
);

export const sendInwardResponse = createAsyncThunk(
  "invoice/sendInwardResponse",
  async (data, thunkAPI) => {
    const store = thunkAPI.getState();
    const web5 = store.did.web5;
    if (!web5) {
      return [];
    }
    console.log(data);
    const did = store.did.did;
    const recordId = data.recordId;
    data["@type"] = "inwardresponse";
    data["author"] = did;
    data["parentId"] = recordId;
    const { record, status: createStatus } = await web5.dwn.records.create({
      data,
      message: {
        protocol: protocolDefinition.protocol,
        protocolPath: "inwardresponse",
        schema: protocolDefinition.types.inwardresponse.schema,
        dataFormat: protocolDefinition.types.inwardresponse.dataFormats[0],
      },
    });
    console.log("create inward response: ", createStatus);
    const { status: recipientSendStatus } = await record.send(
      data.recipientDid
    );
    if (recipientSendStatus.code !== 202) {
      console.error(recipientSendStatus);
      throw new Error("Error while storing to recipient dwn");
    }
    console.log("recipientSendStatus:", recipientSendStatus);
    return record;
  }
);

export const getOutwardInvoices = createAsyncThunk(
  "invoice/getOutwardInvoices",
  async (arg, thunkAPI) => {
    const store = thunkAPI.getState();
    const web5 = store.did.web5;
    if (!web5) {
      return [];
    }
    const did = store.did.did;
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: protocolDefinition.types.invoice.schema,
        },
        dateSort: "createdAscending",
      },
    });
    const filteredRecords = records.filter((val) => val.author == did);
    const result = {};

    let i = 1;
    for (const record of filteredRecords) {
      const data = await record.data.json();
      data["recordId"] = record.id;
      data["status"] = "Not Paid";
      data["id"] = i;
      i += 1;
      result[record.id] = data;
    }

    const { records: inwardResponse } = await web5.dwn.records.query({
      from: did,
      message: {
        filter: {
          schema: protocolDefinition.types.inwardresponse.schema,
        },
        dateSort: "createdAscending",
      },
    });
    console.log("inwardResponse", inwardResponse)
    for (let ir of inwardResponse) {
      const IRdata =await ir.data.json();
      if (result.hasOwnProperty(IRdata.parentId)) {
        result[IRdata.parentId]["status"] = "Paid";
        result[IRdata.parentId]["inwardResponse"] = IRdata
        console.log("response", result[ir.id]);
      }
    }
    return Object.values(result);
  }
);

export const getInwardInvoices = createAsyncThunk(
  "invoice/getInwardInvoices",
  async (arg, thunkAPI) => {
    const store = thunkAPI.getState();
    const web5 = store.did.web5;
    if (!web5) {
      return [];
    }
    const did = store.did.did;
    const { records } = await web5.dwn.records.query({
      from: did,
      message: {
        filter: {
          schema: protocolDefinition.types.invoice.schema,
        },
        dateSort: "createdAscending",
      },
    });
    const filteredRecords = records.filter((val) => val.author != did);
    const result = {};

    let i = 1;
    for (const record of filteredRecords) {
      const data = await record.data.json();
      data["recordId"] = record.id;
      data["status"] = "Pending";
      data["id"] = i;
      i += 1;
      result[record.id] = data;
    }

    const { records: inwardResponse } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: protocolDefinition.types.inwardresponse.schema,
        },
        dateSort: "createdAscending",
      },
    });
    console.log("inwardResponse", inwardResponse)

    for (let ir of inwardResponse) {
      const IRdata =await ir.data.json();
      if (result.hasOwnProperty(IRdata.parentId)) {
        result[IRdata.parentId]["status"] = "Paid";
        result[IRdata.parentId]["inwardResponse"] = IRdata
        console.log("response", result[ir.id]);
      }
    }
    return Object.values(result);
  }
);

export const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    outwardInvoices: [],
    inwardInvoices: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendInvoice.fulfilled, (state, action) => {
      console.log(action.payload);
      toastSucess("Invoice created successfully!");
    });

    builder.addCase(sendInvoice.rejected, (state, action) => {
      console.error(action.error);
      toastError(action.error.message);
    });

    builder.addCase(getOutwardInvoices.fulfilled, (state, action) => {
      console.log(action.payload);
      state.outwardInvoices = action.payload;
    });

    builder.addCase(getOutwardInvoices.rejected, (state, action) => {
      console.error(action.error);
      toastError(action.error.message);
    });

    builder.addCase(getInwardInvoices.fulfilled, (state, action) => {
      console.log(action.payload);
      state.inwardInvoices = action.payload;
    });

    builder.addCase(getInwardInvoices.rejected, (state, action) => {
      console.error(action.error);
      toastError(action.error.message);
    });

    builder.addCase(sendInwardResponse.rejected, (state, action) => {
      console.error(action.error);
      toastError(action.error.message);
    });
  },
});

export default invoiceSlice.reducer;
