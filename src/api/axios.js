import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api", // Replace with your API base URL
  timeout: 5000,
  headers: {
    "Allow-Cross-Origin-Origin": "*",
  }, // Set a timeout for requests (in milliseconds)
});

export default instance;
