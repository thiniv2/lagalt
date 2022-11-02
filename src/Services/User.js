import axios from 'axios'

const url =process.env.REACT_APP_API_URL + "User/"
const configLogin = {
  headers:
  {
    "Content-Type": "application/json"
  }
}
export const Login = async (userData) => {
  try {
    const res = await axios.post(url + 'login', userData, configLogin)
    return res.data
  }catch(error) {
    return error.response.data
  }
}

export const getUserById = (id) => {
  const req = axios.get(url + `${id}`);
  return req.then((res) => res.data);
};

const configBio = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    "Content-Type": "application/json"
  }
}

export const updateBiography = async (bio, id) => {
  try {
    const res = await axios.put(url + id + "/bio", bio, configBio)
    return res.data
  } catch (error) {
    return error
  }
}

export const getSkills = async (id) => {
  const res = await axios.get(url + id + "/skills")
  return res.data
}

export const updateSkills = async (skills, id) => {
    const res = await axios.put(url + id + "/skills", skills, configBio)
    return res.data
}