import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Col, Button } from "react-bootstrap";
import ShowProducts from "./App.js";

/* Anthony Phan, asianp12@iastate.edu, SEP 25, 2025 */

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    <ShowProducts />
  </div>
);
