export interface PrimaryIndexIrBuilderShape {
  pk: { [key: string]: string | number };
  sk: { [key: string]: string | number } | never;
  compositeSk: never | string;
}

export interface SecondaryIndexIrBuilderShape
  extends PrimaryIndexIrBuilderShape {
  defaultQueryFieldSuffix: string;
  queryField: string;
}
