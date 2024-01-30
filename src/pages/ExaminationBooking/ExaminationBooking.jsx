import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import instance from "../../api/axios";
import TablePaginationActions from "../../components/Table/CustomTablePagination";
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
import Sidebar from "../../components/Sidebar";
import moment from "moment";

export default function ExaminationBooking() {
  const [bookings, setBookings] = useState([]);
  const userInfor = useSelector((state) => state.orebiReducer.userInfo);
  const [message, setMessage] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    type: null,
    content: "",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bookings.length) : 0;

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
      const { data } = await instance.delete(`/examination-bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfor.token}`,
        },
      });
      fetchListBookings(data.message);
    } catch (error) {
      fetchListBookings(error.response.data.message, "error");
    }
  };

  const fetchListBookings = async (mess, type) => {
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
      const { data } = await instance.get("/examination-bookings/all", {
        headers: {
          Authorization: `Bearer ${userInfor.token}`,
        },
      });
      setBookings(data);
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
    fetchListBookings();
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
        {bookings.length && (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                      User
                    </TableCell>
                    <TableCell align="left" style={{ width: 30 }}>
                      Description
                    </TableCell>
                    <TableCell align="left" style={{ width: 30 }}>
                      Date
                    </TableCell>
                    <TableCell align="left" style={{ width: 40 }}>
                      Status
                    </TableCell>
                    <TableCell align="left" style={{ width: 40 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? bookings.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : bookings
                  ).map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell style={{ width: 70 }}>
                        {row.description}
                      </TableCell>
                      <TableCell style={{ width: 30 }} align="left">
                        {moment(row.date).format("DD/MM/YYYY HH::mm")}
                      </TableCell>
                      <TableCell style={{ width: 30 }} align="left">
                        {!row.status ? (
                          <div
                            style={{
                              background: "yellow",
                              padding: "10px 5px 10px 5px",
                              textAlign: "center",
                            }}
                          >
                            Pending
                          </div>
                        ) : (
                          <div
                            style={{
                              background: "green",
                              padding: "10px 5px 10px 5px",
                              textAlign: "center",
                            }}
                          >
                            Approved
                          </div>
                        )}
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
              count={bookings.length}
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
