import { string, integer, float } from '../src/ModelField';

describe('Validate', () => {
  describe('String', () => {
    it('should validate string fields', () => {
      const stringField1 = string().validate(v => v.minLength(5, 'String must be at least 5 characters long'));
      // const stringField2 = string().validate(v => v
    });
  });
});