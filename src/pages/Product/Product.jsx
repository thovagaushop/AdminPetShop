import React, { useEffect, useState } from "react";
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
  TablePagination,
  TableRow,
} from "@mui/material";
import instance from "../../api/axios";
import TablePaginationActions from "../../components/Table/CustomTablePagination";
import { getProductImage } from "../../utils";
import FormProduct from "./FormProduct";
import { useSelector } from "react-redux";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userInfor = useSelector((state) => state.orebiReducer.userInfo);
  const [message, setMessage] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    type: null,
    content: "",
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnack = () => {
    setMessage({ ...message, open: false });
  };

  const handleDelete = (id) => async () => {
    try {
      const { data } = await instance.delete(`/product/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfor.token}`,
        },
      });
      fetchListProduct(data.message);
    } catch (error) {
      fetchListProduct(error.response.data.message, "error");
    }
  };

  const fetchListProduct = async (mess, type) => {
    if (mess && !type) {
      setMessage({
        ...message,
        open: true,
        type: "success",
        content: mess,
      });
    } else if (type === "error") {
      setMessage({
        ...message,
        open: true,
        type: "error",
        content: mess,
      });
    }
    try {
      const { data } = await instance.get("/product?pageSize=100");
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
      <div className="container" style={{ paddingRight: "30px" }}>
        <Snackbar
          anchorOrigin={{
            vertical: message.vertical,
            horizontal: message.horizontal,
          }}
          autoHideDuration={10000}
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
        <div
          style={{
            fontWeight: "bold",
            fontSize: "40px",
            textAlign: "center",
          }}
        >
          Products
        </div>
        <div
          className="btn btn-primary"
          style={{ marginBottom: "20px", marginTop: "20px" }}
          onClick={() => setShowModal(true)}
        >
          Add product
        </div>
        {products.length && (
          <Paper sx={{ width: "95%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="custom pagination table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 20 }} align="left">
                      #
                    </TableCell>
                    <TableCell style={{ width: 50, height: 50 }}>
                      Image
                    </TableCell>
                    <TableCell align="left">Title</TableCell>
                    <TableCell align="left" style={{ width: 30 }}>
                      Quantity
                    </TableCell>
                    <TableCell align="left">Price</TableCell>
                    <TableCell align="left" style={{ width: 30 }}>
                      Discount
                    </TableCell>
                    <TableCell align="left" style={{ width: 40 }}>
                      Final Price
                    </TableCell>
                    <TableCell align="left" style={{ width: 40 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? products.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : products
                  ).map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell
                        onClick={() => {
                          setProduct(row);
                          setShowModal(true);
                        }}
                      >
                        {index}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setProduct(row);
                          setShowModal(true);
                        }}
                      >
                        <img
                          src={getProductImage(row.images[0])}
                          alt={row.title}
                          width={50}
                          height={50}
                        />
                      </TableCell>
                      <TableCell
                        style={{ width: 70 }}
                        onClick={() => {
                          setProduct(row);
                          setShowModal(true);
                        }}
                      >
                        {row.title}
                      </TableCell>
                      <TableCell
                        style={{ width: 30 }}
                        align="left"
                        onClick={() => {
                          setProduct(row);
                          setShowModal(true);
                        }}
                      >
                        {row.quantity}
                      </TableCell>
                      <TableCell
                        style={{ width: 30 }}
                        align="left"
                        onClick={() => {
                          setProduct(row);
                          setShowModal(true);
                        }}
                      >
                        $ {row.price}
                      </TableCell>
                      <TableCell
                        style={{ width: 30 }}
                        align="left"
                        onClick={() => {
                          setProduct(row);
                          setShowModal(true);
                        }}
                      >
                        {row.discount}%
                      </TableCell>
                      <TableCell
                        style={{ width: 30 }}
                        align="left"
                        onClick={() => {
                          setProduct(row);
                          setShowModal(true);
                        }}
                      >
                        $ {row.specialPrice}
                      </TableCell>
                      <TableCell style={{ width: 30 }}>
                        <button onClick={handleDelete(row.id)}>Delete</button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              style={{ width: "100%" }}
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </Paper>
        )}
      </div>

      <div
        className={`modal ${showModal ? "show" : ""}`}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Product
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setShowModal(false);
                  setProduct(null);
                }}
              ></button>
            </div>
            <div class="modal-body">
              <FormProduct
                onSubmit={(mess, type) => {
                  fetchListProduct(mess, type);
                  setProduct(null);
                  setShowModal(false);
                }}
                updateProduct={product}
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  setShowModal(false);
                  setProduct(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
