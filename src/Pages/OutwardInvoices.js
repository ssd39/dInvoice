import React, { useEffect, useState } from "react";
import PageHeader from "../Components/PageHeader";
import { motion } from "framer-motion";
import InvoiceForm from "../Components/InvoiceForm";
import { getOutwardInvoices } from "../redux/invoiceSlice";
import { useSelector, useDispatch } from "react-redux";
import CustomDataTable from "../Components/CustomDataTable";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Skeleton from "@mui/material/Skeleton";
import LinearProgress from "@mui/material/LinearProgress";
import Lottie from "lottie-react";
import NoDataAnimation from "../Components/no-data-lottie.json";
import InvoiceModal from "../Components/InvoiceModal";

export default function OutwardInvoices() {
  const [vCreateInovice, setVCreateInvoice] = useState(false);
  const [vInvoiceId, setVInvoiceId] = useState(-1);
  const invoices = useSelector((state) => state.invoice.outwardInvoices);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const animationContainer = {
    hidden: { scaleX: 0, scaleY: 0 },
    show: {
      scaleX: 1,
      scaleY: 1,
    },
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "billTo",
      headerName: "Billed To",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "invoiceNumber",
      headerName: "Invoice Number",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subTotal",
      headerName: "Total",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        return params.row.subTotal + "  " + params.row.currency;
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "invoiceTag",
      headerName: "Tag",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dateOfIssue",
      headerName: "Due Date",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "acceptIn",
      headerName: "Acceptance Method",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.3,
      sortable: false,
      disableClickEventBubbling: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              setVInvoiceId(params.id);
            }}
            className="shadow-xl gradient-bg on-row-focus   text-white p-1 rounded-full  cursor-pointer  active:scale-90"
          >
            <ArrowForwardIosIcon />
          </div>
        );
      },
    },
  ];

  const updateInvoiceData = () => {
    setLoading(true);
    dispatch(getOutwardInvoices()).then(() => setLoading(false));
  };
  useEffect(() => {
    updateInvoiceData();
  }, []);

  useEffect(() => {
    console.log(invoices);
  }, [invoices]);

  return (
    <div className="w-full  h-full  relative">
      {vInvoiceId != -1 && (
        <div className="absolute flex h-full w-full p-4 z-10">
          <motion.div
            variants={animationContainer}
            initial="hidden"
            animate="show"
            className="bg-white flex-1 p-4 rounded-lg shadow-xl px-4 overflow-scroll"
            transition={{ type: "spring", stiffness: 100 }}
          >
            <button
              onClick={() => {
                setVInvoiceId(-1);
              }}
              className=" rounded-full inline-block gradient-bg text-white p-2 cursor-pointer active:scale-90 shadow-xl"
            >
              <ArrowBackIosNewIcon />
            </button>
            <InvoiceModal
              info={invoices[vInvoiceId-1]}
              items={invoices[vInvoiceId-1].items}
              currency={invoices[vInvoiceId-1].currency}
              subTotal={invoices[vInvoiceId-1].subTotal}
              taxAmmount={invoices[vInvoiceId-1].taxAmmount}
              discountAmmount={invoices[vInvoiceId-1].discountAmmount}
              total={invoices[vInvoiceId-1].total}
            />
          </motion.div>
        </div>
      )}
      {vCreateInovice && (
        <div className="absolute flex h-full w-full p-4 z-10">
          <motion.div
            variants={animationContainer}
            initial="hidden"
            animate="show"
            className="bg-white flex-1 p-4 rounded-lg shadow-xl px-4 overflow-scroll"
            transition={{ type: "spring", stiffness: 100 }}
          >
            <button
              onClick={() => {
                setVCreateInvoice(false);
              }}
              className=" rounded-full inline-block gradient-bg text-white p-2 cursor-pointer active:scale-90 shadow-xl"
            >
              <ArrowBackIosNewIcon />
            </button>
            <InvoiceForm
              onSent={() => {
                setVCreateInvoice(false);
                updateInvoiceData();
              }}
            />
          </motion.div>
        </div>
      )}
      <div className="w-full  h-full  flex flex-col p-4">
        <PageHeader title={"Outward Invoices"} />
        <div className="bg-white flex flex-col flex-1 p-4 rounded-lg shadow-xl px-4 mt-4">
          <div>
            <button
              onClick={() => {
                setVCreateInvoice(true);
              }}
              className="dbutton inline-block active:scale-90 px-4 py-2 shadow-xl"
            >
              Create Invoice
            </button>
          </div>
          <div className="mt-2 flex-1">
            <CustomDataTable
              disableRowSelectionOnClick
              disableColumnMenu
              autoPageSize
              rows={invoices}
              columns={columns}
              slots={{
                loadingOverlay: () => {
                  return (
                    <div className="!h-full flex flex-col bg-white w-full ">
                      <div>
                        <LinearProgress className="rounded" />
                      </div>
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        className="!h-full "
                      />
                    </div>
                  );
                },
                noRowsOverlay: () => {
                  return (
                    <div className="!h-full !w-full flex flex-col relative justify-center items-center">
                      <div className="w-80">
                        <Lottie animationData={NoDataAnimation} />
                      </div>
                      <span className="text-lg font-bold text-[#155799]">
                        0 Invoices
                      </span>
                    </div>
                  );
                },
              }}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
