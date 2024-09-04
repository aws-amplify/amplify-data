/**
 * Util that takes a model operation response and throws an error if errors
 * are present, or if the data is undefined.
 * @param response - model operation response
 * @param operation - operation name
 * @returns data from response
 */
export const expectDataReturnWithoutErrors = <T>(
  response: { data?: T; errors?: any },
  operation: string,
): T => {
  if (response.errors) {
    console.log(`error on ${operation}:`, response.errors);
    throw new Error(JSON.stringify(response.errors));
  }

  if (!response.data) {
    throw new Error(`no response data for ${operation}`);
  }

  return response.data;
};
