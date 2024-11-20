import { Container, Card, Col, Button } from "react-bootstrap";
import LeftNavBar from "./LeftNavBar.js";
import { useState, useEffect } from "react";

function ShowProducts() {
  const [catalog, setCatalog] = useState([]);
  const [filteredCatalog, setFilteredCatalog] = useState([]);
  const [categories, setCategories] = useState([]);  

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/products.json");
      const data = await response.json();
      setCatalog(data);
      setFilteredCatalog(data);

      // Extract unique categories from the fetched products
      const uniqueCategories = [...new Set(data.map(product => product.category))];
      setCategories(uniqueCategories);

      console.log(data);
    };
    fetchData();
  }, []);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Left Navigation Bar */}
      <div style={{ width: "350px" }}>
        <LeftNavBar
          catalog={catalog}
          setCatalog={setCatalog}
          filteredCatalog={filteredCatalog}
          setFilteredCatalog={setFilteredCatalog}
          categories={categories}
        />
      </div>
      {/* Main Content Area */}
      <div className="flex-grow-1 p-4">
        <h1>Welcome to the Product Page</h1>
        <div className="row">
          {filteredCatalog.map((product) => (
            <div key={product.id} className="col-md-4">
              <div className="card mb-4">
                <img
                  src={product.image}
                  className="card-img-top"
                  style={{ width: "150px", margin: "auto", paddingTop: "20px" }}
                  alt={product.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">
                    <strong>Price:</strong> ${product.price} <br />
                    <strong>Category:</strong> {product.category} <br />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShowProducts;