import axios from 'axios';

export const registerUser = async (data) => {
  try {
    const response = await axios.post(
      'http://localhost:3003/api/users/register',
      JSON.stringify(data),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(
      'http://localhost:3003/api/users/login',
      JSON.stringify(data), 
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
 }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post('http://localhost:3003/api/users/logout', null, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
  }
};

export const getToken = async () => {
  try {
    const response = await axios.post(`http://localhost:3003/api/users/get-token`, null, {
      withCredentials: true,
    })
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
  }
};

export const getUser = async (token) => {
  try {
    const response = await axios.get(`http://localhost:3003/api/users/get-user`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
  }
};

export const forgotPasswordUser = async (data) => {
  try {
    const response = await axios.put(`http://localhost:3003/api/users/forgot-password`, data, {
      withCredentials: true,
    })
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
  }
}


export const contact = async (data) => {
  try {
    const response = await axios.post(
      'http://localhost:3003/api/users/contact',
      data,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    )
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
  }
};