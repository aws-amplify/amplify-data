Use this folder to add "false coverage" for docs site snippets that are out of scope for integ test coverage and/or are covered elsewhere.

E.g.,

**cli-commands.ts**

```
describe('setup commands', () => {
    test('noop', () => {
        // #region covers a21523923bc82762, b21523923bc82762, c21523923bc82762
        // #endregion
    });
});
```
