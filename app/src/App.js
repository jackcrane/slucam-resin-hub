import React, { useState } from "react";
import { Menu, Tabs, Watermark } from "antd";
import { IconBottle } from "@tabler/icons-react";
import "antd/dist/reset.css";
import "./App.css";
import Resins from "./components/Resins";

const App = () => {
  const [current, setCurrent] = useState("resins");
  return (
    <div className="App">
      <Watermark text="Built by Jack Crane for SLUCAM">
        <Resins />
      </Watermark>
    </div>
  );
};

export default App;
