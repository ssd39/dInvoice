import React, { useEffect, useState } from "react";
import PageHeader from "../Components/PageHeader";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getOutwardInvoices, getInwardInvoices } from "../redux/invoiceSlice";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

export default function Overview() {
  const outInvoices = useSelector((state) => state.invoice.outwardInvoices);
  const inInvoices = useSelector((state) => state.invoice.inwardInvoices);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  const [inComming, setIncomming] = useState({ amount: 0, count: 0 });
  const [outGoing, setOutgoing] = useState({ amount: 0, count: 0 });
  const [pendingCount, setPendingCount] = useState({ in: 0, out: 0 });
  const [tagGroups, setTagGroups] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setLoading(true);
    setDataLoading(true);
    Promise.all([
      dispatch(getOutwardInvoices()),
      dispatch(getInwardInvoices()),
    ]).then(() => {
      setDataLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!dataLoading) {
      setIncomming(
        inInvoices.reduce(
          (prev, cur) => {
            if (cur.status == "Paid") {
              prev.amount += parseFloat(cur.subTotal);
              prev.count += 1;
            }
            return prev;
          },
          { amount: 0, count: 0 }
        )
      );

      setOutgoing(
        outInvoices.reduce(
          (prev, cur) => {
            if (cur.status == "Paid") {
              prev.amount += parseFloat(cur.subTotal);
              prev.count += 1;
            }
            return prev;
          },
          { amount: 0, count: 0 }
        )
      );

      const oc = outInvoices.reduce((prev, cur) => {
        if (cur.status != "Paid") {
          prev += 1;
        }
        return prev;
      }, 0);

      const ic = inInvoices.reduce((prev, cur) => {
        if (cur.status != "Paid") {
          prev += 1;
        }
        return prev;
      }, 0);
      setPendingCount({ in: ic, out: oc });

      const chartData_ = {};

      for (let ini of inInvoices) {
        if (!chartData_.hasOwnProperty(ini.dateOfIssue)) {
          chartData_[ini.dateOfIssue] = {
            name: ini.dateOfIssue,
            inwards: 0,
            outwards: 0,
          };
        }
        chartData_[ini.dateOfIssue].inwards += ini.subTotal;
      }

      for (let ini of outInvoices) {
        if (!chartData_.hasOwnProperty(ini.dateOfIssue)) {
          chartData_[ini.dateOfIssue] = {
            name: ini.dateOfIssue,
            inwards: 0,
            outwards: 0,
          };
        }
        chartData_[ini.dateOfIssue].outwards += ini.subTotal;
      }
      console.log(chartData_);
      setChartData(Object.values(chartData_));

      const catData_ = {
        Other: {
          name: "Other",
          count: 0,
        },
      };

      for (let ini of inInvoices) {
        if (ini.invoiceTag) {
          if (!catData_.hasOwnProperty(ini.invoiceTag)) {
            catData_[ini.invoiceTag] = {
              name: ini.invoiceTag,
              count: 0,
            };
          }
          catData_[ini.invoiceTag].count += 1;
        } else {
          catData_["Other"].count += 1;
        }
      }

      for (let ini of outInvoices) {
        if (ini.invoiceTag) {
          if (!catData_.hasOwnProperty(ini.invoiceTag)) {
            catData_[ini.invoiceTag] = {
              name: ini.invoiceTag,
              count: 0,
            };
          }
          catData_[ini.invoiceTag].count += 1;
        } else {
          catData_["Other"].count += 1;
        }
      }
      console.log(Object.values(catData_));
      setTagGroups(Object.values(catData_));

      setLoading(false);
    }
  }, [dataLoading, outInvoices, inInvoices]);

  return (
    <div className="w-full  h-full  relative">
      <div className="w-full  h-full  flex flex-col p-4">
        <PageHeader title={"Overview"} />
        {isLoading ? (
          <div className="flex-1 p-4  px-4 mt-4">
            <Row className="mb-4">
              <Col md={4}>
                <div className="bg-white flex flex-col flex-1   rounded-lg shadow-xl">
                  <Skeleton variant="rounded" className="w-full" height={200} />
                </div>
              </Col>
              <Col md={4}>
                <div className="bg-white flex flex-col flex-1 rounded-lg shadow-xl">
                  <Skeleton variant="rounded" className="w-full" height={200} />
                </div>
              </Col>
              <Col md={4}>
                <div className="bg-white flex flex-col flex-1 rounded-lg shadow-xl">
                  <Skeleton variant="rounded" className="w-full" height={200} />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <div className="bg-white flex flex-col flex-1   rounded-lg shadow-xl">
                  <Skeleton variant="rounded" className="w-full" height={400} />
                </div>
              </Col>
              <Col md={4}>
                <div className="bg-white flex flex-col flex-1  rounded-lg shadow-xl">
                  <Skeleton variant="rounded" className="w-full" height={400} />
                </div>
              </Col>
              <Col md={4}></Col>
            </Row>
          </div>
        ) : (
          <div className="flex-1 p-4  px-4 mt-4">
            <Row className="mb-4">
              <Col md={4}>
                <div
                  style={{ height: 200 }}
                  className="bg-white flex flex-col flex-1 p-4  rounded-lg shadow-xl"
                >
                  <span className="text-xl font-bold">
                    <span className="text-[#155799] mr-2">
                      {inComming.count}
                    </span>
                    Inward Invoices
                  </span>
                  <div className="flex-1 flex items-center justify-center">
                    {inComming.amount == 0 ? (
                      <span className="font-semibold text-4xl text-[#155799]">
                        {inComming.amount} $
                      </span>
                    ) : (
                      <div className="flex">
                        <div className="mr-2">
                          <span className="font-semibold text-4xl text-red-500">
                            - {inComming.amount} $
                          </span>
                        </div>
                        <TrendingDownIcon className="text-red-500" />
                      </div>
                    )}
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div
                  style={{ height: 200 }}
                  className="bg-white flex flex-col flex-1 p-4  rounded-lg shadow-xl"
                >
                  <span className="text-xl font-bold">
                    <span className="text-[#155799] mr-2">
                      {outGoing.count}
                    </span>
                    Outward Invoices
                  </span>
                  <div className="flex-1 flex items-center justify-center">
                    {outGoing.amount == 0 ? (
                      <span className="font-semibold text-4xl text-[#155799]">
                        {outGoing.amount} $
                      </span>
                    ) : (
                      <div className="flex">
                        <div className="mr-2">
                          <span className="font-semibold text-4xl text-green-500">
                            {outGoing.amount} $
                          </span>
                        </div>
                        <TrendingUpIcon className="text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div
                  style={{ height: 200 }}
                  className="bg-white flex flex-col flex-1 p-4  rounded-lg shadow-xl"
                >
                  <span className="text-xl font-bold">Pending Invoices</span>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold">
                        <span className="text-[#155799] mr-2">
                          {pendingCount.in}
                        </span>
                        Outward Invoices
                      </span>
                      <span className="text-xl font-bold">
                        <span className="text-[#155799] mr-2">
                          {pendingCount.out}
                        </span>
                        Inward Invoices
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <div
                  style={{ height: 400, width: "100%" }}
                  className="bg-white flex flex-col flex-1 p-4  rounded-lg shadow-xl"
                >
                  <span className="text-xl font-bold mb-2">
                    Inwards/Outwards (in $)
                  </span>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      width={500}
                      height={300}
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="outwards"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="inwards"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Col>
              <Col md={4}>
                <div
                  style={{ height: 400 }}
                  className="bg-white flex flex-col flex-1 p-4  rounded-lg shadow-xl"
                >
                  <span className="text-xl font-bold mb-2">
                    Invoices by category
                  </span>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                      <Pie
                        dataKey="count"
                        isAnimationActive={true}
                        data={tagGroups}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Col>
              <Col md={4}></Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}
