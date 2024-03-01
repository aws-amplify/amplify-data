# Testing Strategy

We think about a software and its testing in terms of "proximity to the consumer". This is a function of "how likely it is the consumer will see it". The closest and most visible layer to the consumer is the literal API definition. Beneath this surface are _behaviors_. Behaviors are often un-enumerable in full. So, we work backwards from _Intended Patterns_, running through a checklist of potential permutations and interactions.

1. Intended Patterns
1. Best Practices
1. Plausible Usage
1. Common Edge Cases
1. Uncommon Edge Cases
1. Exhaustive Surface Area
1. Internal Unit Behavior (theoretically _hidden/encapsulated_ behavior)

At the end of this exercise, because the space is never fully enumerable, we end up with tests that fall into two broad categories:

1. Defined Behavior Tests
1. Internal Unit Tests

We treat Defined Behavior Tests as the library's **behavioral contract**. They document, demonstrate, and stabilize library behaviors that are explicitly intended and expected to be used by consumers. Barring critical oversights, security issues, or other extenuating circumstances, these tests MUST NOT change or be removed within a major version. If changed or removed, a new major version (aka. "major version bump") is generally REQUIRED.

Tests outside of the "Defined Behavior" boundary can be considered "Internal". These tests will be copious and treated far less stringently. They can generally be thought of as "development aids". They're produced during development to sanity check internal units. They "loosely clamp" down on _internal_ library behaviors. They can signal when you _might_ have broken something, but they are ultimately **recycleable**. Their failures DO NOT strictly indicate a broken state, and they SHOULD NOT be used to reverse engineer **defined behavior**.

## Test Structure

We will accumulate all Defined Behavior Testing in the `integration-tests` package. Testing directories within `integration-tests` will be structured and treated with a level of rigor commensurate to consumer proximity.

1. `__tests__`
   1. `defined-behavior` &mdash;
      Everything in this folder falls into the "Defined Behavior" category. Changing or removing tests in this folder generally requires a major version bump and must be approved by a PM or admin.
      1. `1-patterns` &mdash;
         Tests showing examples the core coding patterns and "best practices" we would recommend in documentation and Github issues. Mostly hand authored, with the exception of API documentation generation/extraction. Protected by PM, SDM, and SDE Admin approval. Treated like design. Tests look as much like customer app code as possible. In general, seek _abundant_ approval for changes here. When possible, submit tests as failing, skipped tests _first_. Implementation PR's that then un-skip these tests can be less rigorous.
      2. `2-common-use` &mdash;
         Tests showing commonly expected usage, edge cases, and error handling that doesn't fall into normal error handling "patterns". Hand-authored in general. Should ideally look like customer app code. Snippets from these tests may be used in GH issue responses or referred to directly when answering questions around defined behavioral edge cases. Protected by PM + SDE Admin approval.
      3. `3-exhaustive` &mdash;
         The extrapolation of all defined behavioral space within reason. Could be hand authored. But, in general, these tests could and should be programmatically generated according to input dimensions and combinations thereof where cross-dimensional interactions are expected. Protected by SDE Admin.
   2. `internal` &mdash;
      Tests used primarily for development and debugging. Default PR ownership and validation. Not trash, but recyclable. ♻️
   3. _Everything else_ &mdash;
      Leftovers from before we implemented this testing structure. We will extract defined behavior and sort the remainder into the `internal` folder over time.

(Folders are prefixed numerically to keep folder sorting consistent with "proximity to the consumer".)

## Input Space Checklist

When decomposing a defined behavior at any level, here's the checklist of input dimensions you should be prepared to claim you went through. 😅

1. Argument permutations
2. Module State (App, library, class, closure...)
   1. Temporal Coupling
3. Dependencies (imports)
4. Repetition / Idempotency
5. Network conditions
6. File inputs
7. CLI inputs
8. Environment variables
9. AWS Region
10. Timing
11. Platform
    1. OS
       1. Android
       2. iOS
       3. Windows
       4. Mac
       5. Linux (+flavor)
       6. ChromiumOS
    2. Web (FF, Safari, Chrome, Edge, etc.)
    3. Runtime (e.g., node 12, 14, 16, 18 ...)

For each dimension on the list, **assess what behaviors the dimension exposes.**

1. Are the exposed behaviors likely?
1. If so:
   1. Make a testing plan.
   1. Execute the testing plan.
   1. Explain why the tests are sufficient.
1. If not:
   1. Try to test it anyway.
   1. Explain why it's unlikely and/or why it doesn't need tests.

Finally, if you think of any dimensions missing from the list, _add them_. If you can make a case for removing dimensions because it "never affects behavior", remove it from the list with a justification.
