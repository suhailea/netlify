exports.handler = async (event) => {
  const subject = event.queryStringParameters.name || "Wowrld";
  return {
    statusCode: 200,
    body: `Hello ${subject}!`,
  };
};
