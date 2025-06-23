import axios from 'axios';

export const registerUser = async (data) => {
  try {
    const response = await axios.post(
      '/api/users/register',
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
      '/api/users/login',
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
    const response = await axios.post('/api/users/logout', null, {
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
    const response = await axios.post(`/api/users/get-token`, null, {
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
    const response = await axios.get(`/api/users/get`, {
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
    const response = await axios.put(`/api/users/forgot-password`, data, {
      withCredentials: true,
    })
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
  }
}

export const getGuestUser = async () => {
  try {
    const response = await axios.post(`/api/users/get-guest`, null, {
      withCredentials: true,
    })
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
  }
};


export const contact = async (data) => {
  try {
    const response = await axios.post(
      '/api/users/contact',
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

export const updateUser = async (data) => {
  try {
    const response = await axios.put(
      '/api/users/update',
      JSON.stringify(data), 
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error)
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
 }
};

export const discover = async (userId) => {
  try {
    const response = await axios.get(`/api/users/discover/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || "Something went wrong";
    throw new Error(message);
  }
};

export const like = async (userId, targetUserId) => {
  try {
    const response = await axios.post(
      `/api/users/${targetUserId}/like`,
      JSON.stringify({ userId: userId }),
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

export const dislike = async (userId, targetUserId) => {
  try {
    const response = await axios.post(
      `/api/users/${targetUserId}/dislike`,
      JSON.stringify({ userId: userId }),
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