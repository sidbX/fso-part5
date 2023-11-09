import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (blogToBeCreated) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const response = await axios.post(baseUrl, blogToBeCreated, config)
  return response.data
}

const deleteBlog = async (blog) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

const setToken = (sentToken) => {
  token = `Bearer ${sentToken}`
}

const addLike = async (blogId, likes) => {
  const response = await axios.put(`${baseUrl}/${blogId}`, { likes })
  return response.data
}

export default { getAll, setToken, create, addLike, deleteBlog }
