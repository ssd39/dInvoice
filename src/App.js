import "./App.css";
import React, { useEffect } from "react";
import Header from "./Components/Header";
import Menubar from "./Components/Menubar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const navigate = useNavigate();
  const did = useSelector((state) => state.did.did);
  const location = useLocation()
  useEffect(() => {
    if (!did) {
      const next = location.pathname
      navigate(`/?next=${next}`);
    }
  }, [did]);
  return (
    <div className="min-h-screen  flex flex-col">
      <Header />
      <div className="flex-1 flex mt-2 rounded-t-3xl mx-6 m inner-shadow">
        <div className="flex w-full">
          <Menubar />
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
