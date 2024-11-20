import React from "react";

function Summary({setDataF, setViewer, dataF}) {

    const updateHooks = () => {
        setDataF(dataF);    
        setViewer(1);
    }
    
  return (
    <div>
      <h1>Payment summary:</h1>
      <h3>{dataF.fullName}</h3>
        <p>{dataF.email}</p>
        <p>{dataF.creditCard}</p>
        <p>{dataF.address}</p>
        <p>{dataF.city},{dataF.state} {dataF.zip}{" "}</p>
      <button onClick={updateHooks} className="btn btn-secondary">Submit</button>
    </div>
  );
}

export default Summary;