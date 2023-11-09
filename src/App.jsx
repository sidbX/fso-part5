import { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const createBlogRef = useRef()

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

  const createBlog = async (blogToBeCreated) => {
    try {
      const createdBlog = await blogService.create(blogToBeCreated)
      createBlogRef.current.toggleVisibility()
      setBlogs(blogs.concat(createdBlog))
      showNotification(
        `A new blog '${createdBlog.title}' by ${createdBlog.author} added`,
      )
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  const deleteBlog = async (blogToBeDeleted) => {
    try {
      await blogService.deleteBlog(blogToBeDeleted)
      // const updatedBlogs = _.without(blogs, blogToBeDeleted)
      setBlogs(_.without(blogs, blogToBeDeleted))
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  const likeBlog = async (blogToBeLiked) => {
    try {
      const updatedBlog = await blogService.addLike(
        blogToBeLiked.id,
        blogToBeLiked.likes + 1,
      )
      const newBlogs = _.without(blogs, blogToBeLiked).concat(updatedBlog)
      setBlogs(newBlogs)
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  const loginForm = () => (
    <>
      <h1>log in to application</h1>
      <form id="loginForm" onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="loginButton" type="submit">
          Login
        </button>
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
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              loggedInUser={user}
              deleteBlog={deleteBlog}
              likeBlog={likeBlog}
            />
          ))}
      </>
    )
  }

  return (
    <div>
      <Notification message={message} />
      {user === null && loginForm()}
      {/* {user !== null && createBlogForm()} */}
      {user !== null && (
        <Togglable buttonLabel="create new blog" ref={createBlogRef}>
          {/* {createBlogForm()} */}
          <CreateBlogForm createBlog={createBlog} />
        </Togglable>
      )}

      {user !== null && blogsList()}
    </div>
  )
}

export default App
