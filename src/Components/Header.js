import React from "react";
import "./Header.css";
import { useSelector } from "react-redux";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ToolTip from "@mui/material/Tooltip";

export default function Header() {
  const did = useSelector((state) => {
    const fullDid = state.did.did;
    if(fullDid) {
      const didParts = fullDid.split(":");
      return didParts.slice(0, didParts.length - 1).join(":");
    }
    return ""
  });
  const origDid = useSelector((state) => state.did.did);
  return (
    <div className="px-4 py-4 select-none flex items-center">
      <span className=" name text-5xl font-extrabold">dInvoice</span>
      <div className="flex flex-1 justify-end">
        <div className="text-lg text-[#155799] flex items-center inner-shadow p-1 px-3 rounded-3xl">
          <span className="font-bold text-[#159957] text-xl mr-2">Hi,</span>{" "}
          {did}
          <ToolTip title={"Copy DID"}>
            <div
              onClick={() => {
                navigator.clipboard.writeText(origDid)
              }}
              className="ml-2 text-[#159957] text-sm p-1 cursor-pointer active:scale-90 hover:opacity-80 shadow-2xl bg-white rounded-full"
            >
              <ContentCopyIcon />
            </div>
          </ToolTip>
        </div>
      </div>
    </div>
  );
}
