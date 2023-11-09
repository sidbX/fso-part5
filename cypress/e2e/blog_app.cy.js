const user = {
  username: 'testUser',
  password: 'testUserPass',
  name: 'tester',
}
const user2 = {
  username: 'testUser2',
  password: 'testUserPass2',
  name: 'tester22',
}

describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is displayed', () => {
    cy.get('#loginForm')
  })

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#loginButton').click()
      cy.contains(`${user.name} logged in`)
    })

    it('fails with wrong credentials', () => {
      cy.get('#username').type(user.username)
      cy.get('#password').type('1234')
      cy.get('#loginButton').click()
      cy.contains('Wrong username or password')
      cy.get('html').should('not.contain', 'logged in')
    })
  })

  describe('When logged in', () => {
    beforeEach(() => {
      cy.request('POST', 'http://localhost:3003/api/login', user).then(
        (res) => {
          localStorage.setItem('loggedInUser', JSON.stringify(res.body))
          cy.visit('http://localhost:5173')
        },
      )
    })

    const blog = {
      title: 'test title',
      author: 'test author',
      url: 'test.com',
    }
    it('A blog can be created', () => {
      cy.contains('create new blog').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#createBlogButton').click()
      cy.contains(`${blog.title} ${blog.author}`)
    })

    describe('A blog is already present', () => {
      beforeEach(() => {
        cy.contains('create new blog').click()
        cy.get('#title').type(blog.title)
        cy.get('#author').type(blog.author)
        cy.get('#url').type(blog.url)
        cy.get('#createBlogButton').click()
        cy.visit('http://localhost:5173')
        // cy.request({
        //   url: 'http://localhost:3003/api/blogs',
        //   method: 'POST',
        //   body: blog,
        //   headers: {
        //     Authorization: `Bearer ${
        //       JSON.parse(localStorage.getItem('loggedInUser')).token
        //     }`,
        //   },
        // }).then(() => {
        //   cy.visit('http://localhost:5173')
        // })
      })

      it('blog can be liked', () => {
        let initialLikes
        cy.contains('view').click()
        cy.contains('likes')
          .invoke('text')
          .then((text) => {
            initialLikes = Number(text.split(' ')[1])
          })
          .then(() => {
            cy.get('#likeButton').click()
            cy.contains('likes').should(
              'have.text',
              `likes ${initialLikes + 1}`,
            )
          })
      })

      it('blog can be deleted', () => {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', `${blog.title} ${blog.author}`)
      })

      it('only the blog creator can see the delete button', () => {
        //login with another user cred
        cy.request('POST', 'http://localhost:3003/api/users', user2)
        cy.request('POST', 'http://localhost:3003/api/login', user2).then(
          (res) => {
            localStorage.setItem('loggedInUser', JSON.stringify(res.body))
            cy.visit('http://localhost:5173')
          },
        )
        cy.contains('view').click()
        cy.contains(`${blog.title} ${blog.author}`).should(
          'not.contain',
          'remove',
        )
      })

      it('blogs are ordered acc to likes', () => {
        //creating 5 blogs
        cy.addBlogs(5).then(() => {
          let prevBlogLikes = Number.MAX_VALUE
          cy.get('div.blog').each(($blogElement) => {
            cy.wrap( $blogElement ).find('button').click()
            cy.wrap( $blogElement )
              .contains('likes')
              .invoke('text')
              .then((text) => {
                cy.wrap(Number(text.split(' ')[1])).should(
                  'be.lte',
                  prevBlogLikes,
                )
                prevBlogLikes = Number(text.split(' ')[1])
              })
          })
        })
      })
    })
  })
})
