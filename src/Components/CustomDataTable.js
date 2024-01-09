import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

const CustomDataTable = styled(DataGrid)(({ theme }) => ({
  boxShadow:
    "inset 6px 6px 10px 0 rgba(0,0,0,0.2), inset -6px -6px 10px 0 rgba(255,255,255,0.5)",
  background: "#D3CCE3" /* fallback for old browsers */,
  background:
    "-webkit-linear-gradient(to right, #E9E4F0, #D3CCE3)" /* Chrome 10-25, Safari 5.1-6 */,
  background:
    "linear-gradient(to right, #E9E4F0, #D3CCE3)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
  padding: 10,
  fontWeight: 400,
  borderRadius: 12,
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeader:focus": {
    outline: "none",
  },

  "& .MuiDataGrid-columnHeaderTitleContainer:fcous": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeaders": {
    background: "white",
    borderRadius: 12,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
  },
  "& .MuiDataGrid-footerContainer": {
    background: "white",
    borderRadius: 12,
  },
  "& .MuiDataGrid-overlayWrapperInner": {
    "& .MuiDataGrid-overlay": {
      backgroundColor: "transparent !important",
    },
  },
  "& .MuiDataGrid-virtualScrollerRenderZone  .Mui-hovered": {
    background: "#159957",
    color: "white",
    fontWeight: "bold",
    "& .on-row-focus": {
      background: "white",
      color: "#155799 !important",
    },
  },
  "& .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows": {
    margin: 0,
  },
  "& .MuiDataGrid-footerContainer .MuiButtonBase-root:not(.Mui-disabled)": {
    background: "#159957" /* fallback for old browsers */,
    background: "-webkit-linear-gradient(to right, #155799, #159957)",
    background:
      "linear-gradient(to right, #155799, #159957)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
  },
  "& .MuiDataGrid-row": {
    background: "white",
    borderRadius: 12,
    marginTop: 1,
    marginBottom: 1,
  },
}));

export default CustomDataTable;
