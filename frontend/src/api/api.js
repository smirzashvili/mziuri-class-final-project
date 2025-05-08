import axios from 'axios';

export const registerUser = async (data) => {
  try {
    const response = await axios.post(
      'http://localhost:3003/api/users/register',
      JSON.stringify({ data }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (data) => {
  const response = await axios.post(
    'http://localhost:3003/api/users/login',
    JSON.stringify({ data }),
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
  );
  return response;
};

export const logoutUser = async () => {
  const response = await axios.post('http://localhost:3003/api/users/logout', null, {
    withCredentials: true,
  });
  return response.data;
};

export const getToken = () => {
  return axios.post(`http://localhost:3003/api/users/get-token`, null, {
    withCredentials: true,
  });
};

export const getUser = async (token) => {
  const response = await axios.get(`http://localhost:3003/api/users/get-user`, {
    headers: { Authorization: token },
  });
  return response.data;
};
