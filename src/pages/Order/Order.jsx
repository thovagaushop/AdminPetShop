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
  TablePagination,
  TableRow,
} from "@mui/material";
import instance from "../../api/axios";
import TablePaginationActions from "../../components/Table/CustomTablePagination";
import { useSelector } from "react-redux";
import FormCategory from "../Category/FormCategory";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    type: null,
    content: "",
  });
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

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
      const { data } = await instance.delete(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      fetchListOrders(data.message);
    } catch (error) {
      fetchListOrders(error.response.data.message, "error");
    }
  };

  const fetchListOrders = async (mess, type) => {
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
      const { data } = await instance.get("/orders/all", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setOrders(data);
    } catch (error) {
      setMessage({
        ...message,
        open: true,
        type: "error",
        content: error.response.data.message,
      });
    }
  };

  const handleUpdateStatus = async (email, orderId) => {
    try {
      const { data } = await instance.put(
        `/orders/${orderId}`,
        {
          email,
          status: "SUCCESS",
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setMessage({
        ...message,
        open: true,
        type: "success",
        content: data.message,
      });
      fetchListOrders();
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
    fetchListOrders();
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
          autoHideDuration={1000}
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
        {orders.length && (
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
                      Email
                    </TableCell>
                    <TableCell style={{ width: 50, height: 50 }}>
                      Infomation
                    </TableCell>
                    <TableCell style={{ width: 30, height: 50 }}>
                      Payment Type
                    </TableCell>
                    <TableCell style={{ width: 50, height: 50 }}>
                      Status
                    </TableCell>
                    <TableCell style={{ width: 50, height: 50 }}>
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? orders.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : orders
                  ).map((row, index) => (
                    <TableRow key={row.orderId} onClick={() => setOrder(row)}>
                      <TableCell>{index}</TableCell>

                      <TableCell style={{ width: 70 }}>{row.email}</TableCell>
                      <TableCell style={{ width: 70 }}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {row.orderItems?.map((el) => (
                            <>
                              <div>
                                {el.product.title} x {el.quantity}
                              </div>
                              <hr />
                            </>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell style={{ width: 30 }}>
                        <div
                          className={
                            row.payment?.paymentMethod === "CAST"
                              ? "btn-warning"
                              : "btn-primary"
                          }
                        >
                          {row.payment?.paymentMethod}
                        </div>
                      </TableCell>
                      <TableCell style={{ width: 50 }}>
                        <button
                          className={
                            row.orderStatus === "PENDING"
                              ? "btn btn-warning"
                              : "btn btn-success"
                          }
                          onClick={() =>
                            handleUpdateStatus(row.email, row.orderId)
                          }
                        >
                          {row.orderStatus}
                        </button>
                      </TableCell>
                      <TableCell style={{ width: 80 }}>
                        {row.orderDate}
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
              count={orders.length}
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
      <div></div>
    </>
  );
}
