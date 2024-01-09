import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/didSlice";
import { checkProtocol } from "./redux/protocolSlice";
import "./Components/ScreenEffect.css";
import ScreenEffect from "./Components/ScreenEffect";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setLoading] = useState(false);
  const isDiDError = useSelector((state) => state.did.isError);
  const isProtocolError = useSelector((state) => state.protocol.isError);
  const did = useSelector((state) => state.did.did);
  const ref = useRef();
  useEffect(() => {
    /*dispatch(connect()).then(() => {
      dispatch(checkProtocol()).then(() => {
        setLoading(false);
      });
    });*/
    if (ref.current) {
      const config = {
        effects: {
          roll: {
            enabled: false,
            options: {
              speed: 1000,
            },
          },
          image: {
            enabled: false,
            options: {
              src: "",
              blur: 1.2,
            },
          },
          vignette: { enabled: true },
          scanlines: { enabled: true },
          vcr: {
            enabled: true,
            options: {
              opacity: 1,
              miny: 220,
              miny2: 220,
              num: 70,
              fps: 60,
            },
          },
          wobbley: { enabled: true },
          snow: {
            enabled: false,
            options: {
              opacity: 0.2,
            },
          },
        },
      };

      const screen = new ScreenEffect("#screen");
      setTimeout(() => {
        for (const prop in config.effects) {
          if (!!config.effects[prop].enabled) {
            screen.add(prop, config.effects[prop].options);
          }
        }
      }, 1000);
    }
  }, [ref.current]);

  useEffect(() => {
    if (isDiDError) {
    }
    if (isProtocolError) {
    }
    if (!isLoading && !isProtocolError && !isDiDError && did) {
      const searchParams = new URLSearchParams(location.search);
      const next = searchParams.get("next");
      if (next) {
        navigate(next);
      } else {
        navigate("/app/overview");
      }
    }
  }, [isDiDError, isProtocolError, did, isLoading]);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center">
      <div
        style={{ position: "relative" }}
        className="flex items-center justify-center"
      >
      

        <img src="/logo.png" className="z-10" />
      </div>
      <span className="text-emerald-400  mt-11 text-xl font-extrabold">
        Empowering with transparency, security, and privacy. Simplifying data
        for insightful finance solutions.
      </span>
      <div
        onClick={() => {
          setLoading(true)
          dispatch(connect()).then(() => {
            dispatch(checkProtocol()).then(() => {
              setLoading(false);
            });
          });
        }}
        className={`text-black select-none shadow-2xl rounded-lg p-2 px-4 font-bold mt-6 active:scale-90 cursor-pointer ${isLoading? 'bg-black':'bg-white '}`}
      >
        {isLoading ? <CircularProgress />: "Launch App"}
      </div>
    </div>
  );
}
