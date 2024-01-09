import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OutwardInvoices from "./Pages/OutwardInvoices";
import Home from "./Home";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InwardInvoices from "./Pages/InwardInvoices";
import Overview from "./Pages/Overview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "/app/overview",
        element: <Overview />,
        index: true,
      },
      {
        path: "/app/payroll",
        element: (
          <div className="w-full  h-full  relative flex items-center justify-center">
            <span className="text-2xl font-bold text-[#155799]">
              Hope you liked the dInvoice :) We are excited to deliver payroll
              feature as soon as possible. Stay tune, Thanks!
            </span>
          </div>
        ),
      },
      {
        path: "/app/inward-invoices",
        element: <InwardInvoices />,
      },
      {
        path: "/app/outward-invoices",
        element: <OutwardInvoices />,
      },
      {
        path: "/app/settings",
        element: (
          <div className="w-full  h-full  relative flex items-center justify-center">
            <span className="text-2xl font-bold text-[#155799]">
              Hope you liked the dInvoice :) We are excited to deliver settings
              feature as soon as possible. Stay tune, Thanks!
            </span>
          </div>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ToastContainer />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
