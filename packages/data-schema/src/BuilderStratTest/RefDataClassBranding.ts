import { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import {
  Brand,
  brand,
  buildData,
  bindDataGetter,
  DataObject,
} from './utils/Builder';
const __auth = Symbol('Auth');

const brandName = 'ref';

export const getData = bindDataGetter<RefTypeDataKlass>();

export type RefTypeData = {
  type: 'ref';
  link: string;
  required: boolean;
  authorization: object[];
};

class RefTypeDataKlass {
  link: string;
  required: boolean;
  authorization: object[];
  constructor(args: {
    link: string;
    required: boolean;
    authorization: object[];
  }) {
    this.link = args.link;
    this.required = args.required;
    this.authorization = args.authorization;
  }
}

export type RefTypeParamShape = {
  link: string;
  required: boolean;
  authorization: object[];
};

export type RefType<
  T extends RefTypeParamShape,
  K extends keyof RefType<T> = never,
  Auth = undefined,
  // Branding the exported type allows us to detect it
  // nominally in our mapped types, ignoring structural overlap with other types
> = Omit<
  {
    /**
     * Marks a field as required.
     */
    required(): RefType<SetTypeSubArg<T, 'required', true>, K | 'required'>;
    /**
     * Configures field-level authorization rules. Pass in an array of authorizations `(a.allow.____)` to mix and match
     * multiple authorization rules for this field.
     */
    authorization<AuthRuleType extends object>(
      rules: AuthRuleType[],
    ): RefType<T, K | 'authorization', AuthRuleType>;
  },
  K
> & {
  // This is a lie. This property is never set at runtime. It's just used to smuggle auth types through.
  [__auth]?: Auth;
} & Brand<typeof brandName> &
  DataObject<RefTypeDataKlass>;

function _ref<T extends RefTypeParamShape>(link: T['link']): RefType<T> {
  const data: RefTypeData = {
    type: 'ref',
    link,
    required: false,
    authorization: [],
  };

  const builder: RefType<T> = {
    ...brand(brandName),
    ...buildData(new RefTypeDataKlass(data)),
    required() {
      getData(this).required = true;

      return this;
    },
    authorization(rules: object[]) {
      getData(this).authorization = rules;

      return this;
    },
  };

  return { ...builder };
}

type RefTypeArgFactory<Link extends string> = {
  type: 'ref';
  link: Link;
  required: false;
  authorization: [];
};

export function ref<Value extends string, T extends Value>(link: T) {
  return _ref<RefTypeArgFactory<T>>(link);
}
