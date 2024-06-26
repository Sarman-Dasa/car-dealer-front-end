import axios from "axios";
import notify from "./notify";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

//Axios post request

async function axiosPostResponse(url, requestData = {}, message = false) {
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  let data = await axiosInstance
    .post(url, requestData)
    .then((result) => {
      if (result && result.status === 200) {
        const { data } = result;

        if (message) {
          notify.success(data.message);
        }

        return data || null;
      }
    })
    .catch((err) => {
      const response = err?.response;
      const errorMessage = response?.data?.message;
      notify.error(errorMessage);
    });
  return data;
}

async function axiosGetResponse(url, requestData = {}, message = false) {
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  let data = await axiosInstance
    .get(url, { params: requestData })
    .then((result) => {
      if (result && result.status === 200) {
        const { data } = result;

        if (message) {
          notify.success(data.message);
        }

        return data || null;
      }
    })
    .catch((err) => {});
  return data;
}

async function axiosDeleteResponse(url, requestData = {}, message = false) {
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  let data = await axiosInstance
    .delete(url, { params: requestData })
    .then((result) => {
      if (result && result.status === 200) {
        const { data } = result;

        if (message) {
          notify.success(data.message);
        }

        return data || null;
      }
    })
    .catch((err) => {});
  return data;
}

export { axiosPostResponse, axiosGetResponse, axiosDeleteResponse };
