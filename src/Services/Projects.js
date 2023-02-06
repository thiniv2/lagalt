import axios from "axios";
const url = process.env.REACT_APP_API_URL;

export const getAllProjectBanners = () => {
  const req = axios.get(url + "project/AllBanners");
  return req.then((res) => res.data);
};

export const getProjectBannerById = (id) => {
  const req = axios.get(url + `project/${id}`);
  return req.then((res) => res.data);
};

export const getProjectsByOwnerId = (id) => {
  const req = axios.get(url + 'project/owner/' + id)
  return req
}

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const addNewProject = (projectData) => {
  const req = axios.post(url + "project", projectData, config)
  return req.then(res=> res.data)
};

const configProgress = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
};

export const updateProgress = async (progress, id) => {
  try {
    const res = await axios.put(
      url + "project/" + id + "/progress",
      progress,
      configProgress
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const addNewApplicant = async (applicantId, projectId, letter, username) => {

  const applicantDto = {
    userId: applicantId,
    username: username,
    letter: letter
  }
  //axios put to some url
  const req = await axios.put(url + 'project/' + projectId + '/addApplicant', applicantDto, configProgress)
  return req.then(res => res.data)
}

export const deleteApplicant = async (applicantId, projectId) => {
  const req = await axios.put(url + 'project/' + projectId + '/deleteApplicant', applicantId, configProgress)
  return req
}

export const getProjectById = async (projectId) => {
  const req = await axios.get(url + 'project/' + projectId)
  return req
}

export const acceptApplicant = async (projectId, applicantId) => {
  let users = []
  await getProjectById(projectId).then(a => {
    
    a.data.users.forEach(user => {
      users.push(user.id)
    })
  })
  .then(users.push(applicantId))
  .then(() => {
    const res = axios.put(url + 'project/' + projectId + '/users', users, configProgress)
    return res
  })
  .then(() => {
    const res = axios.put(url + 'project/' + projectId + '/deleteApplicant', applicantId, configProgress)
    return res
  })
  
  
} 