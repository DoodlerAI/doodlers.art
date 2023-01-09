import axios from 'axios';

export const url: any = 'http://173.247.237.3:5000';
export const base_url: any = 'http://173.247.237.3:80';
// const url = "http://localhost:5000";

export const postRegisterData = async (formdata: any) => {
  try {
    const { email, password } = formdata;

    const res = await axios.post(`${url}/api/auth/register`, {
      email,
      password,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const postRegisterDataByGmail = async (formdata: any) => {
  try {
    const { email } = formdata;

    const res = await axios.post(`${url}/api/auth/registerByGmail`, { email });

    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const postLoginData = async (formData: any) => {
  try {
    const { email, password } = formData;
    const res = await axios.post(`${url}/api/auth/login`, { email, password });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const activateAccount = async (activationToken: any) => {
  try {
    const res = await axios.post(`${url}/api/auth/activate-account`, {
      activationToken,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const renewAccessToken = async () => {
  try {
    const res = await axios.post(`${url}/api/auth/renew-access-token`, null);
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.get(`${url}/api/auth/logout`);
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const forgotPassword = async (email: any) => {
  try {
    const res = await axios.post(`${url}/api/auth/forgot-password`, { email });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const resetPassword = async (password: any, email: any) => {
  try {
    const res = await axios.post(`${url}/api/auth/reset-password`, {
      password,
      email,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getProfile = async (accessToken: any) => {
  try {
    const res = await axios.get(`${url}/api/profile`, {
      headers: { Authorization: accessToken },
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const updateProfile = async (formdata: any) => {
  const { email, id } = formdata;

  try {
    const res = await axios.put(`${url}/api/profile`, { email, id });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const updateProfileByAdmin = async (formdata: any) => {
  const { id, email } = formdata;

  try {
    const res = await axios.put(`${url}/api/profile/updateUserByAdmin`, {
      id,
      email,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const updatePassword = async (password: any, id: any) => {
  try {
    const res = await axios.post(`${url}/api/auth/reset-password`, {
      password,
      id,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getMembers = async () => {
  try {
    const res = await axios.get(`${url}/api/users`);
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const requestGeneration = async (data: any) => {
  try {
    const {
      email,
      generation_mode,
      prompt,
      width,
      height,
      cfg_scale,
      seed,
      steps,
      iterations,
      sampler_name,
    } = data;

    const res = await axios.post(`${url}/api/report`, {
      email,
      generation_mode,
      prompt,
      width,
      height,
      cfg_scale,
      seed,
      steps,
      iterations,
      sampler_name,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const terminateRequestWithEmail = async (
  id: string,
  waitingTime: number,
  file_url: string
) => {
  console.log('terminateRequestWithEmail', id, waitingTime, file_url);
  try {
    const res = await axios.put(`${url}/api/report/readyWithEmail`, {
      id,
      waitingTime,
      url: file_url,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const terminateRequest = async (
  id: string,
  waitingTime: number,
  file_url: string
) => {
  console.log('terminateRequest', id, waitingTime, file_url);
  try {
    const res = await axios.put(`${url}/api/report`, {
      id,
      waitingTime,
      url: file_url,
      txt: 'updated_txt',
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const deleteImgByURL = async (file_url: string) => {
  console.log('file_url', file_url);
  try {
    const res = await axios.post(`${url}/api/report/deleteByURL`, {
      url: file_url,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getReports = async () => {
  try {
    const res = await axios.get(`${url}/api/report`);
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getImageDetail = async (file_url: string) => {
  try {
    const res = await axios.post(`${url}/api/report/image-detail`, {
      url: file_url,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const like = async (
  email1: string,
  email2: string,
  file_url: string
) => {
  try {
    const res = await axios.post(`${url}/api/review/like`, {
      email1,
      email2,
      url: file_url,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const unlike = async (
  email1: string,
  email2: string,
  file_url: string
) => {
  try {
    const res = await axios.post(`${url}/api/review/unlike`, {
      email1,
      email2,
      url: file_url,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getLikes = async (email: string, file_url: string) => {
  try {
    const res = await axios.post(`${url}/api/review/getlikes`, {
      email,
      url: file_url,
    });
    return Promise.resolve(res.data.likes);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getLikesByEmail = async (email: string) => {
  try {
    const res = await axios.post(`${url}/api/review/getLikesByEmail`, {
      email,
    });
    return Promise.resolve(res.data.likes);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getLikesByURL = async (file_url: string) => {
  try {
    const res = await axios.post(`${url}/api/review/getlikesByURL`, {
      url: file_url,
    });
    return Promise.resolve(res.data.likes);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getDataByURL = async (file_url: string) => {
  try {
    const res = await axios.post(`${url}/api/report/getDataByURL`, {
      url: file_url,
    });
    return Promise.resolve(res.data.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getIsLike = async (
  email1: string,
  email2: string,
  file_url: string
) => {
  try {
    const res = await axios.post(`${url}/api/review/getIslike`, {
      email1,
      email2,
      url: file_url,
    });
    return Promise.resolve(res.data.isLike);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const follow = async (email1: string, email2: string) => {
  try {
    const res = await axios.post(`${url}/api/review/follow`, {
      email1,
      email2,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const unfollow = async (email1: string, email2: string) => {
  try {
    const res = await axios.post(`${url}/api/review/unfollow`, {
      email1,
      email2,
    });
    return Promise.resolve(res.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getFollowsByEmail = async (email: string) => {
  try {
    const res = await axios.post(`${url}/api/review/getFollowByEmail`, {
      email,
    });
    return Promise.resolve(res.data.followings);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getFollowStatus = async (email1: string, email2: string) => {
  try {
    const res = await axios.post(`${url}/api/review/getFollowStatus`, {
      email1,
      email2,
    });
    return Promise.resolve(res.data.followed);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getURLsByEmail = async (email: string) => {
  try {
    const res = await axios.post(`${url}/api/report/getURLsByEmail`, {
      email,
    });
    return Promise.resolve(res.data.data);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};

export const getFollowerByEmail = async (email: string) => {
  try {
    const res = await axios.post(`${url}/api/review/getFollowerByEmail`, {
      email,
    });
    return Promise.resolve(res.data.followers);
  } catch (err: any) {
    return Promise.reject(err.response?.data?.msg);
  }
};
