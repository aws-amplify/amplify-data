export interface PrimaryIndexIrShape {
  pk: { [key: string]: string | number };
  sk: { [key: string]: string | number } | never;
  compositeSk: never | string;
}

export interface SecondaryIndexIrShape extends PrimaryIndexIrShape {
  defaultQueryFieldSuffix: string;
  queryField: string;
}
