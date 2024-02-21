import { bench } from '@arktype/attest';
import { builderTest } from '@aws-amplify/data-schema';

bench('current internal casting ref builder', () => {
  const ref = builderTest
    .refInternalCasting('test')
    .required()
    .authorization([]);
  (ref as builderTest.InternalRefInternalCasting).data.link;
}).types([833, 'instantiations']);

bench('branded data bindings', () => {
  const ref = builderTest.refBranding('test').required().authorization([]);
  builderTest.getDataBranding(ref);
}).types([228, 'instantiations']);

bench('branded class data bindings', () => {
  const ref = builderTest.refKBranding('test').required().authorization([]);
  builderTest.getDataKBranding(ref);
}).types([228, 'instantiations']);
