import React from "react";
import Divider from "@mui/material/Divider";

export default function PageHeader({ title }) {
  return (
    <div>
      <div className="mb-4 bg-white p-2 rounded-lg shadow-xl px-4">
        <span className="font-bold text-3xl text-[#155799]">{title}</span>
      </div>
      <div className="css-9mgopn-MuiDivider-root" />
    </div>
  );
}
