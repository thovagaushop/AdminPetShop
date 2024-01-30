import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  Alert,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import instance from "../../api/axios";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    type: null,
    content: "",
  });

  const handleCloseSnack = () => {
    setMessage({ ...message, open: false });
  };

  const fetchListProduct = async () => {
    try {
      const { data } = await instance.get("/product");
      setProducts(data.data);
    } catch (error) {
      setMessage({
        ...message,
        open: true,
        type: "error",
        content: error.response.data.message,
      });
    }
  };
  useEffect(() => {
    fetchListProduct();
  }, []);
  return (
    <>
      <Sidebar />
      <div className="container">
        <Snackbar
          anchorOrigin={{
            vertical: message.vertical,
            horizontal: message.horizontal,
          }}
          open={message.open}
          onClose={handleCloseSnack}
          message="I love snacks"
          key={message.vertical + message.horizontal}
        >
          <Alert
            onClose={handleCloseSnack}
            severity={message.type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message.content}
          </Alert>
        </Snackbar>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Title</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price&nbsp;(g)</TableCell>
                <TableCell align="right">Discount&nbsp;(g)</TableCell>
                <TableCell align="right">Special Price&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length &&
                products.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right">{index}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell align="right">{row.discount}</TableCell>
                    <TableCell align="right">{row.specialPrice}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div>Hello</div>
    </>
  );
}
