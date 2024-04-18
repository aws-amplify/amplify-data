import { a } from '../index';

describe('.authorization(allow) builder disallowed use cases', () => {
  describe('allow.resource()', () => {
    it('cannot be used with a.model()', () => {
      expect(() =>
        a
          .model({
            title: a.string(),
          })
          // @ts-expect-error allow.resource() is unavailable in conjunction of a.model()
          .authorization((allow) => allow.resource()),
      ).toThrow('allow.resource is not a function');
    });

    it('cannot be used with model field', () => {
      expect(() =>
        // @ts-expect-error allow.resource() is unavailable in conjunction of a model field
        a.string().authorization((allow) => allow.resource()),
      ).toThrow('allow.resource is not a function');
    });

    it('cannot be used with a.query()', () => {
      expect(() =>
        // @ts-expect-error allow.resource() is unavailable in conjunction of a.query()
        a.query().authorization((allow) => allow.resource()),
      ).toThrow('allow.resource is not a function');
    });

    it('cannot be used with a.mutation()', () => {
      expect(() =>
        // @ts-expect-error allow.resource() is unavailable in conjunction of a.mutation()
        a.mutation().authorization((allow) => allow.resource()),
      ).toThrow('allow.resource is not a function');
    });

    it('cannot be used with a.subscription()', () => {
      expect(() =>
        // @ts-expect-error allow.resource() is unavailable in conjunction of a.subscription()
        a.subscription().authorization((allow) => allow.resource()),
      ).toThrow('allow.resource is not a function');
    });
  });

  describe('allow.owner()', () => {
    it('cannot be used with a.query()', () => {
      expect(() =>
        // @ts-expect-error allow.owner() is unavailable in conjunction of a.query()
        a.query().authorization((allow) => allow.owner()),
      ).toThrow('allow.owner is not a function');
    });

    it('cannot be used with a.mutation()', () => {
      expect(() =>
        // @ts-expect-error allow.owner() is unavailable in conjunction of a.mutation()
        a.mutation().authorization((allow) => allow.owner()),
      ).toThrow('allow.owner is not a function');
    });

    it('cannot be used with a.subscription()', () => {
      expect(() =>
        // @ts-expect-error allow.owner() is unavailable in conjunction of a.subscription()
        a.subscription().authorization((allow) => allow.owner()),
      ).toThrow('allow.owner is not a function');
    });
  });

  describe('allow.ownerDefinedIn()', () => {
    it('cannot be used with a.query()', () => {
      expect(() =>
        // @ts-expect-error allow.ownerDefinedIn() is unavailable in conjunction of a.query()
        a.query().authorization((allow) => allow.ownerDefinedIn('field')),
      ).toThrow('allow.ownerDefinedIn is not a function');
    });

    it('cannot be used with a.mutation()', () => {
      expect(() =>
        // @ts-expect-error allow.ownerDefinedIn() is unavailable in conjunction of a.mutation()
        a.mutation().authorization((allow) => allow.ownerDefinedIn('field')),
      ).toThrow('allow.ownerDefinedIn is not a function');
    });

    it('cannot be used with a.subscription()', () => {
      expect(() =>
        a
          .subscription()
          // @ts-expect-error allow.ownerDefinedIn() is unavailable in conjunction of a.subscription()
          .authorization((allow) => allow.ownerDefinedIn('field')),
      ).toThrow('allow.ownerDefinedIn is not a function');
    });
  });

  describe('allow.ownersDefinedIn()', () => {
    it('cannot be used with a.query()', () => {
      expect(() =>
        // @ts-expect-error allow.ownersDefinedIn() is unavailable in conjunction of a.query()
        a.query().authorization((allow) => allow.ownersDefinedIn('field')),
      ).toThrow('allow.ownersDefinedIn is not a function');
    });

    it('cannot be used with a.mutation()', () => {
      expect(() =>
        // @ts-expect-error allow.ownersDefinedIn() is unavailable in conjunction of a.mutation()
        a.mutation().authorization((allow) => allow.ownersDefinedIn('field')),
      ).toThrow('allow.ownersDefinedIn is not a function');
    });

    it('cannot be used with a.subscription()', () => {
      expect(() =>
        a
          .subscription()
          // @ts-expect-error allow.ownersDefinedIn() is unavailable in conjunction of a.subscription()
          .authorization((allow) => allow.ownersDefinedIn('field')),
      ).toThrow('allow.ownersDefinedIn is not a function');
    });
  });

  describe('allow.groupDefinedIn()', () => {
    it('cannot be used with a.query()', () => {
      expect(() =>
        // @ts-expect-error allow.groupDefinedIn() is unavailable in conjunction of a.query()
        a.query().authorization((allow) => allow.groupDefinedIn('field')),
      ).toThrow('allow.groupDefinedIn is not a function');
    });

    it('cannot be used with a.mutation()', () => {
      expect(() =>
        // @ts-expect-error allow.groupDefinedIn() is unavailable in conjunction of a.mutation()
        a.mutation().authorization((allow) => allow.groupDefinedIn('field')),
      ).toThrow('allow.groupDefinedIn is not a function');
    });

    it('cannot be used with a.subscription()', () => {
      expect(() =>
        a
          .subscription()
          // @ts-expect-error allow.groupDefinedIn() is unavailable in conjunction of a.subscription()
          .authorization((allow) => allow.groupDefinedIn('field')),
      ).toThrow('allow.groupDefinedIn is not a function');
    });
  });

  describe('allow.groupsDefinedIn()', () => {
    it('cannot be used with a.query()', () => {
      expect(() =>
        // @ts-expect-error allow.groupsDefinedIn() is unavailable in conjunction of a.query()
        a.query().authorization((allow) => allow.groupsDefinedIn('field')),
      ).toThrow('allow.groupsDefinedIn is not a function');
    });

    it('cannot be used with a.mutation()', () => {
      expect(() =>
        // @ts-expect-error allow.groupsDefinedIn() is unavailable in conjunction of a.mutation()
        a.mutation().authorization((allow) => allow.groupsDefinedIn('field')),
      ).toThrow('allow.groupsDefinedIn is not a function');
    });

    it('cannot be used with a.subscription()', () => {
      expect(() =>
        a
          .subscription()
          // @ts-expect-error allow.groupsDefinedIn() is unavailable in conjunction of a.subscription()
          .authorization((allow) => allow.groupsDefinedIn('field')),
      ).toThrow('allow.groupsDefinedIn is not a function');
    });
  });

  describe(`.to() method`, () => {
    (['query', 'mutation', 'subscription'] as const).forEach(
      (customOperation) => {
        test.each([
          ['publicApiKey'] as const,
          ['guest'] as const,
          ['authenticated'] as const,
          ['group'] as const,
          ['groups'] as const,
          ['custom'] as const,
        ])(
          `it cannot be used in conjunction of a.${customOperation}().authorization(allow => allow.%p())`,
          (builderName) => {
            if (builderName === 'group') {
              expect(() =>
                a[customOperation]().authorization((allow) =>
                  // @ts-expect-error .to() is expected unavailable
                  allow[builderName]('Admin').to('title'),
                ),
              ).toThrow('.to is not a function');
            } else if (builderName === 'groups') {
              expect(() =>
                a[customOperation]().authorization((allow) =>
                  // @ts-expect-error .to() is expected unavailable
                  allow[builderName](['Admin', 'Editor']).to('title'),
                ),
              ).toThrow('.to is not a function');
            } else
              expect(() =>
                a[customOperation]().authorization((allow) =>
                  // @ts-expect-error .to() is expected unavailable
                  allow[builderName]().to('field'),
                ),
              ).toThrow('.to is not a function');
          },
        );
      },
    );
  });

  describe(`.withClaimIn() method`, () => {
    (['query', 'mutation', 'subscription'] as const).forEach(
      (customOperation) => {
        test.each([['group'] as const, ['groups'] as const])(
          `it cannot be used in conjunction of a.${customOperation}().authorization(allow => allow.%p())`,
          (builderName) => {
            if (builderName === 'group') {
              expect(() =>
                a[customOperation]().authorization((allow) =>
                  // @ts-expect-error .withClaimIn() is expected unavailable
                  allow[builderName]('Admin').withClaimIn('title'),
                ),
              ).toThrow('.withClaimIn is not a function');
            } else if (builderName === 'groups') {
              expect(() =>
                a[customOperation]().authorization((allow) =>
                  // @ts-expect-error .withClaimIn() is expected unavailable
                  allow[builderName](['Admin', 'Editor']).withClaimIn('title'),
                ),
              ).toThrow('.withClaimIn is not a function');
            }
          },
        );
      },
    );
  });
});
