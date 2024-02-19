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
import FormCategory from "./FormCategory";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categories.length) : 0;

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
      const { data } = await instance.delete(`/category/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      fetchListCategories(data.message);
    } catch (error) {
      fetchListCategories(error.response.data.message, "error");
    }
  };

  const fetchListCategories = async (mess, type) => {
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
      const { data } = await instance.get("/category?pageSize=100");
      setCategories(data.data);
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
    fetchListCategories();
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
        {categories.length && (
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
                      Name
                    </TableCell>
                    <TableCell align="left" style={{ width: 40 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? categories.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : categories
                  ).map((row, index) => (
                    <TableRow
                      key={row.categoryId}
                      onClick={() => setCategory(row)}
                    >
                      <TableCell>{index}</TableCell>

                      <TableCell style={{ width: 70 }}>
                        {row.categoryName}
                      </TableCell>
                      <TableCell style={{ width: 30 }}>
                        <button onClick={handleDelete(row.categoryId)}>
                          Delete
                        </button>
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
              count={categories.length}
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
      <FormCategory
        style={{ marginLeft: "20" }}
        onSubmit={(mess, type) => {
          fetchListCategories(mess, type);
          setCategory(null);
        }}
        updateCategory={category}
      />
    </>
  );
}
