import { useState } from 'react'

const Blog = ({ blog, loggedInUser, deleteBlog, likeBlog }) => {
  const [expandedView, setExpandedView] = useState(false)
  // const [likes, setLikes] = useState(blog.likes)

  console.log('rendering blog component')
  let buttonLabel = expandedView ? 'hide' : 'view'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleClickLike = async () => {
    // try {
    //   const updatedBlog = await blogService.addLike(blogId, likes + 1)
    //   setLikes(likes + 1)
    //   console.log(updatedBlog)
    // } catch (exception) {
    //   alert(exception.message)
    // }
    await likeBlog(blog)
  }

  const handleRemoveBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      // await blogService.deleteBlog(blog)
      await deleteBlog(blog)
    }
  }

  const fullDetails = () => (
    <>
      <div>
        {blog.url}
        <br />
        <span>likes {blog.likes}</span>
        <button
          id="likeButton"
          type="button"
          onClick={() => handleClickLike(blog)}
        >
          like
        </button>
        <br />
        {blog.user.username}
        {loggedInUser.username === blog.user.username && (
          <div>
            <button type="button" onClick={handleRemoveBlog}>
              remove
            </button>
          </div>
        )}
      </div>
    </>
  )

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button type="button" onClick={() => setExpandedView(!expandedView)}>
        {buttonLabel}
      </button>
      {expandedView && fullDetails()}
    </div>
  )
}

export default Blog
