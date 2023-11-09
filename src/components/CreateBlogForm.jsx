import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    const blogToBeCreated = { title, author, url }
    //   const createdBlog = await blogService.create(blogToBeCreated)
    await createBlog(blogToBeCreated)
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <form onSubmit={handleCreateBlog}>
      <div>
        title:
        <input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          id="author"
          type="text"
          name="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          id="url"
          type="text"
          name="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button id="createBlogButton" type="submit">
        create
      </button>
    </form>
  )
}

CreateBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default CreateBlogForm
