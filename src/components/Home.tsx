import axios from "axios";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [customerlist, setCustomerList] = useState([]);
  const [selectedcustomer, setSelectedCustomer] = useState("");
  const [productOptions, setProductOptions] = useState<any>([]);
  const [tableRows, setTableRows] = useState<any>([
    {
      id: 1,
      product: "",
      quantity: 0,
      unitPrice: 0,
      subTotal: 0,
    },
  ]);
  const [rowCount, setRowCount] = useState(1);

  const addRow = () => {
    setTableRows([
      ...tableRows,
      {
        id: rowCount + 1,
        product: "",
        quantity: 0,
        unitPrice: 0,
        subTotal: 0,
        selectedproduct: "",
      },
    ]);
    setRowCount(rowCount + 1);
  };

  const removeRow: any = (id: number) => {
    debugger;
    setTableRows(tableRows.filter((row: any) => row.id !== id));
    setRowCount(rowCount - 1);
  };

  useEffect(() => {
    const url = "https://dummyjson.com/users";

    axios.get(url).then((res) => {
      const response = res.data;
      setCustomerList(response.users);
    });
  }, []);

  const customerSelect = (customer: any) => {
    setSelectedCustomer(customer.firstName);
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowId: number
  ) => {
    const updatedRows = tableRows.map((row: any) => {
      if (row.id === rowId) {
        const quantity = Number(event.target.value);
        const unitPrice = row.unitPrice;
        const subTotal = quantity * unitPrice;

        return {
          ...row,
          quantity: quantity,
          subTotal: subTotal,
        };
      }
      return row;
    });
    setTableRows(updatedRows);
  };

  const productSelector = (product: any, rowId: number) => {
    const updatedRows = tableRows.map((row: any) => {
      if (row.id === rowId) {
        const quantity = row.quantity;
        const unitPrice = product.price;
        const subTotal = quantity * unitPrice;

        return {
          ...row,
          selectedProduct: product.title,
          unitPrice: unitPrice,
          subTotal: subTotal,
        };
      }
      return row;
    });
    setTableRows(updatedRows);
  };
  const subtotal = tableRows.reduce(
    (sum: number, row: any) => sum + row.subTotal,
    0
  );
  const tax = 200;
  const grandTotal = subtotal + tax;

  useEffect(() => {
    const url = "https://dummyjson.com/products";

    axios.get(url).then((res) => {
      const response = res.data;
      setProductOptions(response.products);
    });
  }, []);
  return (
    <>
      <h1>Customers</h1>
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {selectedcustomer || "Customer"}
        </button>

        <div className="dropdown-menu">
          {customerlist.map((customer: any) => (
            <button
              onClick={() => customerSelect(customer)}
              className="dropdown-item"
              key={customer.id}
            >
              {customer.firstName}
            </button>
          ))}
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">SR.NO</th>
              <th scope="col">PRODUCT</th>
              <th scope="col">QUANTITY</th>
              <th scope="col">UNITPRICE</th>
              <th scope="col">SUBTOTAL</th>
              <th scope="col">
                <button className="btn btn-color-green" onClick={addRow}>
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row: any, index: any) => (
              <tr>
                <th scope="row"> {index + 1}</th>
                <td>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {row.selectedProduct || "Product"}
                    </button>

                    <div className="dropdown-menu">
                      {productOptions.map((product: any) => (
                        <button
                          onClick={() => productSelector(product, row.id)}
                          className="dropdown-item"
                          key={product.id}
                        >
                          {product.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </td>
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(event) => handleQuantityChange(event, row.id)}
                />
                <td>
                  <input
                    type="number"
                    value={
                      productOptions.find(
                        (options: any) => options.title === row.selectedProduct
                      )?.price || ""
                    }
                  />
                </td>
                <td>{row.subTotal}</td>
                <td>
                  <button onClick={() => removeRow(row.id)}>*</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Product Name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row: any, index: any) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.selectedProduct}</td>
                <td>
                  {
                    productOptions.find(
                      (options: any) => options.title === row.selectedProduct
                    )?.price
                  }
                </td>
                <td>{row.quantity}</td>
                <td>{row.subTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">Subtotal</th>
              <th scope="col">Tax</th>
              <th scope="col">Final PRice</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{subtotal}</td>
              <td>{tax}</td>
              <td>{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
