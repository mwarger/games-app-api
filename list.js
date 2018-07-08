import * as dynamoDbLib from './libs/dynamodb-lib'
import { success, failure } from './libs/response-lib'

export async function main(event, context, callback) {
  const params = {
    TableName: 'games',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': event.userId
        ? event.userId
        : event.requestContext.authorizer.claims.sub
    }
  }

  try {
    const result = await dynamoDbLib.call('query', params)

    // Return the matching list of items in response body
    callback(null, event.userId ? result.Items : success(result.Items))
  } catch (e) {
    callback(null, failure({ status: false }))
  }
}
