import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const testBlog = {
  title: 'testTitle',
  author: 'testAuthor',
  url: 'testURL.com',
  likes: 54,
  user: {
    username: 'testUser',
  },
}

const loggedInUser = {
  username: 'testUser',
}

const likeBlog = jest.fn()

beforeEach(() => {
  render(
    <Blog blog={testBlog} loggedInUser={loggedInUser} likeBlog={likeBlog} />,
  )
})

test('blog should only render the title and author', async () => {
  expect(screen.queryByText(testBlog.title)).toBeDefined()
  expect(screen.queryByText(testBlog.author)).toBeDefined()
  expect(screen.queryByText(testBlog.url)).toBeNull()
})

test('blog URL and likes are displayed when view is clicked', async () => {
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  expect(screen.queryByText(testBlog.url)).toBeDefined()
  expect(screen.queryByText(`likes ${testBlog.likes}`)).toBeDefined()
})

test('if like button is clicked twice, the likeBlog fn is called twice', async () => {
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(likeBlog.mock.calls).toHaveLength(2)
})
