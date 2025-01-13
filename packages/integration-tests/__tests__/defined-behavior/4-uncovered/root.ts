/**
 * Intentionally uncovered snippets from https://docs.amplify.aws/ and https://docs.amplify.aws/react/
 *
 * High level overview snippet.
 */

describe('/', () => {
  // #region covers 193a2a390fb5a565
  // #endregion

  test('react', () => {
    // #region covers fe8797e13aaa1221
    // #endregion
  });

  test('data-modeling', () => {
    // #region covers 18d9bf46eea33c9b
    // sample graphql schema provided directly to `defineData()`.
    // #endregion
  });

  test('connect-to-api', () => {
    // #region covers 898189587ea17dac
    // generic imports + configure
    // #endregion
  });

  test('subscribe-data', () => {
    // #region covers 3d50d3d345883f3f, ccefe4830defbe18
    // connection state change Hub events and connection management sample code.
    // this package doesn't directly interact with Hub. these events are emitted by the
    // core JS library graphql package.
    // TODO: consider whether this should be configured with an e2e anyway.
    // #endregion
  });
});
