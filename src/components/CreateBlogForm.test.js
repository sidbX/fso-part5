import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('form calls eventhandler properly when a new blog is created', async () => {
  const createBlog = jest.fn()
  const blogToBeCreated = {
    title: 'newTitle',
    author: 'newAuthor',
    url: 'newUrl.com',
  }

  const { container } = render(<CreateBlogForm createBlog={createBlog} />)

  const user = userEvent.setup()
  const titleInput = container.querySelector('input[name="title"]')
  const authorInput = container.querySelector('input[name="author"]')
  const urlInput = container.querySelector('input[name="url"]')
  const createBlogButton = screen.getByText('create')

  await user.type(titleInput, blogToBeCreated.title)
  await user.type(authorInput, blogToBeCreated.author)
  await user.type(urlInput, blogToBeCreated.url)
  await user.click(createBlogButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe(blogToBeCreated.title)
  expect(createBlog.mock.calls[0][0].author).toBe(blogToBeCreated.author)
  expect(createBlog.mock.calls[0][0].url).toBe(blogToBeCreated.url)
})
