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
  console.log('Created blog data: ', response.data)
  return response.data
}

const setToken = (sentToken) => {
  token = `Bearer ${sentToken}`
}

export default { getAll, setToken, create }
