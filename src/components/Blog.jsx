import { useState } from 'react'

const Blog = ({ blog }) => {
  const [expandedView, setExpandedView] = useState(false)

  let buttonLabel = expandedView ? 'hide' : 'view'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const fullDetails = () => (
    <>
      <div>
        {blog.url}
        <br />
        likes {blog.likes}
        <button type="button">like</button>
        <br />
        {blog.user.username}
      </div>
    </>
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button type="button" onClick={() => setExpandedView(!expandedView)}>
          {buttonLabel}
        </button>
        {expandedView && fullDetails()}
      </div>
    </div>
  )
}

export default Blog
