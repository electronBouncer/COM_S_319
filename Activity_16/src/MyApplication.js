import React, { useState } from "react";
import Payment from "./MyPayment";
import Summary from "./MySummary";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const [dataF, setDataF] = useState({});
  const [viewer, setViewer] = useState(1); 

  return (
    <div>
      {viewer === 1 && (<Payment dataF={dataF} setDataF={setDataF} setViewer={setViewer} />)}
      {viewer === 2 && (<Summary dataF={dataF} setDataF={setDataF} setViewer={setViewer} />)}
    </div>
  );
}

export default App;