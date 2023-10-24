import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const cachedUser = window.localStorage.getItem('loggedInUser')
    if (cachedUser) {
      setUser(JSON.parse(cachedUser))
      blogService.setToken(JSON.parse(cachedUser).token)
    }
  }, [])

  const showNotification = (notificationMessage) => {
    setMessage(notificationMessage)
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with ' + username + ' ' + password)
    try {
      const loggedInUser = await loginService.login({ username, password })
      setUser(loggedInUser)
      window.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
      blogService.setToken(loggedInUser.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('Wrong username or password')
    }
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const blogToBeCreated = { title, author, url }
      const createdBlog = await blogService.create(blogToBeCreated)
      setBlogs(blogs.concat(createdBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      showNotification(`A new blog '${createdBlog.title}' by ${createdBlog.author} added`)
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  const loginForm = () => (
    <>
      <h1>log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  )

  const blogsList = () => {
    return (
      <>
        <h2>blogs</h2>
        <p>
          {user.name} logged in
          <button
            type="button"
            onClick={() => {
              setUser(null)
              window.localStorage.removeItem('loggedInUser')
            }}
          >
            logout
          </button>
        </p>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </>
    )
  }

  const createBlogForm = () => {
    return (
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
            type="text"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    )
  }

  return (
    <div>
      <Notification message={message} />
      {user === null && loginForm()}
      {user !== null && createBlogForm()}
      {user !== null && blogsList()}
    </div>
  )
}

export default App
