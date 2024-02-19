import { Box, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import { useSelector } from "react-redux";
import { getProductImage } from "../../utils";

const petTypes = [
  {
    value: "SENIOR_DOG",
    label: "Senior Dog",
  },
  {
    value: "CAT",
    label: "Cat",
  },
  {
    value: "FISH",
    label: "Fish",
  },
  {
    value: "SMALL_PET",
    label: "Small Pet",
  },
  {
    value: "BIRD",
    label: "Bird",
  },
  {
    value: "REPTILE",
    label: "Reptile",
  },
  {
    value: "RABBIT",
    label: "Rabbit",
  },
];

export default function FormProduct({ onSubmit, updateProduct }) {
  const [categories, setCategories] = useState([]);
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: 0,
    rating: 0,
    discount: 0,
    quantity: 0,
    images: [],
    categoryId: "",
    petType: "",
  });

  const handleWithFile = async (file) => {
    console.log(file);
    if (
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg"
    ) {
      setProduct((prevProduct) => {
        const updatedImages = Array.isArray(prevProduct.images)
          ? [...prevProduct.images, file]
          : [file];
        return {
          ...prevProduct,
          images: updatedImages,
        };
      });
      // setProduct({ ...product, images: [...product.images, file] });
    } else {
      // Handle other file types
      onSubmit("Unsupported file type");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (updateProduct) {
        console.log({ product });
        await instance.put(`/product/${updateProduct.id}`, product, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
      } else {
        await instance.post("/product", product, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
      }

      onSubmit("Add success");
      setProduct({
        title: "",
        description: "",
        price: 0,
        rating: 0,
        discount: 0,
        quantity: 0,
        images: [],
        categoryId: "",
        petType: "",
      });
    } catch (error) {
      onSubmit(error.response.data.message, "error");
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await instance.get("/category?pageSize=100");
      setCategories(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setProduct({ ...updateProduct });
  }, [updateProduct]);
  console.log(product.petType);
  return (
    <div
      style={{
        marginTop: "70px",
        textAlign: "center",
        overflow: "scroll",
      }}
    >
      <Box
        style={{ marginLeft: "20px", backgroundColor: "#fff" }}
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <div style={{ fontSize: "24px" }}>Form</div>
        <div>
          <TextField
            id="outlined-select-currency"
            select
            label="Category"
            defaultValue="0"
            helperText="Please select product category"
            size="small"
            style={{ width: "80%" }}
            onChange={(e) =>
              setProduct({ ...product, categoryId: e.target.value })
            }
            value={product.categoryId}
          >
            {categories.map((option) => (
              <MenuItem key={option.categoryId} value={option.categoryId}>
                {option.categoryName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="outlined-select-currency"
            select
            label="Pet type"
            defaultValue="0"
            helperText="Please select pet type"
            size="small"
            style={{ width: "80%" }}
            onChange={(e) =>
              setProduct({ ...product, petType: e.target.value })
            }
            value={product.petType ?? ""}
          >
            {petTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-error"
            label="Title"
            size="small"
            style={{ width: "80%" }}
            placeholder="Enter title"
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            value={product.title}
            focused={!!updateProduct}
          />
          <TextField
            id="outlined-error-helper-text"
            label="Description"
            size="small"
            style={{ width: "80%" }}
            placeholder="Enter description"
            multiline
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            value={product.description}
            focused={!!updateProduct}
          />
          <TextField
            id="outlined-number"
            label="Price"
            type="number"
            size="small"
            style={{ width: "80%" }}
            placeholder="Enter description"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            value={product.price}
            focused={!!updateProduct}
          />
          <TextField
            id="outlined-number"
            label="Rating"
            type="number"
            size="small"
            style={{ width: "80%" }}
            placeholder="Enter rating"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setProduct({ ...product, rating: e.target.value })}
            value={product.rating}
            focused={!!updateProduct}
          />
          <TextField
            id="outlined-number"
            label="Quantity"
            type="number"
            size="small"
            style={{ width: "80%" }}
            placeholder="Enter Quantity"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setProduct({ ...product, quantity: e.target.value })
            }
            value={product.quantity}
            focused={!!updateProduct}
          />
          <TextField
            id="outlined-number"
            label="Discount"
            type="number"
            size="small"
            style={{ width: "80%" }}
            placeholder="Enter discount"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setProduct({ ...product, discound: e.target.value })
            }
            value={product.discount}
            focused={!!updateProduct}
          />

          {updateProduct ? (
            <div>
              <img
                src={getProductImage(updateProduct.images[0])}
                width={70}
                height={70}
                alt="Img 1"
              />
            </div>
          ) : (
            <></>
          )}

          <TextField
            id="outlined-number"
            label="Image 1"
            type="file"
            size="small"
            style={{ width: "80%" }}
            placeholder="Enter description"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => handleWithFile(e.target.files[0])}
          />

          {updateProduct ? (
            <div>
              <img
                src={getProductImage(updateProduct.images[1])}
                width={70}
                height={70}
                alt="Img 1"
              />
            </div>
          ) : (
            <></>
          )}

          <TextField
            id="outlined-number"
            label="Image 2"
            type="file"
            size="small"
            style={{ width: "80%" }}
            placeholder="Enter description"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => handleWithFile(e.target.files[0])}
          />

          {updateProduct ? (
            <div>
              <img
                src={getProductImage(updateProduct.images[2])}
                width={70}
                height={70}
                alt="Img 1"
              />
            </div>
          ) : (
            <></>
          )}
          <TextField
            id="outlined-number"
            label="Image 3"
            type="file"
            size="small"
            style={{ width: "80%" }}
            placeholder="Enter description"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => handleWithFile(e.target.files[0])}
          />
        </div>
        <button
          style={{
            width: "70px",
            height: "40px",
            margin: "10px",
            textAlign: "center",
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </Box>
    </div>
  );
}
