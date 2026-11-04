const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Para testar outra versão: CYPRESS_baseUrl=http://localhost:3000 npm test
    baseUrl: 'https://danielnaasson.github.io/caca-bug/',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
