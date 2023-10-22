import { SetTypeSubArg } from '@aws-amplify/amplify-api-next-types-alpha';
import { Authorization } from './Authorization';

export type RefTypeParamShape = {
  type: 'ref';
  link: string;
  required: boolean;
  authorization: Authorization<any, any>[];
};

export type RefType<
  T extends RefTypeParamShape,
  _Ref = 'ref',
  K extends keyof RefType<T> = never,
> = Omit<
  {
    required(): RefType<SetTypeSubArg<T, 'required', true>, K | 'required'>;
  },
  K
>;

type RefTypeData = {
  type: 'ref';
  link: string;
  required: boolean;
  authorization: Authorization<any, any>[];
};

/**
 * Internal representation of Ref that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalRef = RefType<RefTypeParamShape> & {
  data: RefTypeData;
};

function _ref<T extends RefTypeParamShape>(link: T['link']) {
  const data: RefTypeData = {
    type: 'ref',
    link,
    required: false,
    authorization: [],
  };

  const builder: RefType<T> = {
    required() {
      data.required = true;

      return this;
    },
  };

  return { ...builder, data } as InternalRef as RefType<T>;
}

// TODO: array, arrayRequired, authorization
type RefTypeArgFactory<Link extends string> = {
  type: 'ref';
  link: Link;
  required: false;
  authorization: [];
};

export function ref<Value extends string, T extends Value>(link: T) {
  return _ref<RefTypeArgFactory<T>>(link);
}

/* testing zone */
const tr = ref('Post').required();
type _T = typeof tr;

type _Test = _T extends RefType<infer T extends RefTypeParamShape, any>
  ? T
  : never;
