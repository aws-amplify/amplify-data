import { defineConfig } from 'cypress';

export default defineConfig({
  includeShadowDom: true,
  defaultCommandTimeout: 30000,
  experimentalWebKitSupport: true,
  experimentalModifyObstructiveThirdPartyCode: true,
  e2e: {
    baseUrl: 'http://localhost:3000/',
    specPattern: 'cypress/e2e/**/*.spec.cy.{ts,js}',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
  },
  chromeWebSecurity: false,
});
