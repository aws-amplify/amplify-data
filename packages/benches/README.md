To run benches:

```
$ npm run bench
```

To create a new bench:

```ts
bench('new bench', () => {
  // do some typey stuff
}).types();
```

Then run `npm run bench` and the instantiation count will appear in the file inside the `.types()` builder.

```ts
bench('new bench', () => {
  // do some typey stuff
}).types([0, 'instantiations']);
```

The value will serve as the baseline for subsequent runs.

If you want to re-baseline the benches, clear the value inside the builder (`.types()`)
