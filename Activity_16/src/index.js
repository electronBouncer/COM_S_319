import React from 'react';
import ReactDOM from 'react-dom/client';
import{useForm} from "react-hook-form";
import App from './MyApplication';
import Payment from "./MyPayment";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

