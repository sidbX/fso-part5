// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
Cypress.Commands.add('addBlogs', (count) => {
  for (let i = 0; i < count; i++) {
    const blog = {
      title: Math.random().toString(36).substring(2, 11),
      author: Math.random().toString(36).substring(2, 11),
      url: Math.random().toString(36).substring(2, 11),
      likes: Math.floor( Math.random() * 500 ),
    }
    cy.request({
      url: 'http://localhost:3003/api/blogs',
      method: 'POST',
      body: blog,
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem('loggedInUser')).token
        }`,
      },
    })
  }
  cy.visit('http://localhost:5173')
})
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
