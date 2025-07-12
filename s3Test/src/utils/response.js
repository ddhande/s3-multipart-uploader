const createResponse = (
  status,
  success,
  message,
  data,
  error,
  // headers = {}
) => {
  return {
    statusCode: status,
    body: JSON.stringify({
      success: success,
      message: message,
      data: data,
      error: error,
    }),
  };
};

export default createResponse;
