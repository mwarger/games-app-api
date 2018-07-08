import * as dynamoDbLib from './libs/dynamodb-lib'
import { success, failure } from './libs/response-lib'

export async function main(event, context, callback) {
  const params = {
    TableName: 'games',
    Key: {
      userId: event.userId || event.requestContext.authorizer.claims.sub,
      gameId: event.gameId || event.pathParameters.id
    }
  }

  try {
    const result = await dynamoDbLib.call('get', params)
    if (result.Item) {
      // Return the retrieved item
      callback(null, event.userId ? result.Item : success(result.Item))
    } else {
      const error = { status: false, error: 'Item not found.' }
      callback(null, event.userId ? error : failure(error))
    }
  } catch (e) {
    callback(
      null,
      event.userId ? { status: false } : failure({ status: false })
    )
  }
}
