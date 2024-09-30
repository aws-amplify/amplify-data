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

In general, since "uncovered" snippet annotations should only be used for snippets that this repository doesn't own the behavior of, we'll generally organize the coverage annotations by URL. In a few cases, snippets are used repeatedly. Those will be in `common.ts`.
