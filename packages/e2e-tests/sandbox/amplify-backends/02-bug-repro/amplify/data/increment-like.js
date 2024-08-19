import { util } from '@aws-appsync/utils';

export function request(ctx) {
  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({ id: ctx.args.postId}),
    update: {
      expression: 'ADD likes :plusTwo',
      expressionValues: { ':plusTwo': { N: 2 } },
    }
  }
}

export function response(ctx) {
  return ctx.result
}