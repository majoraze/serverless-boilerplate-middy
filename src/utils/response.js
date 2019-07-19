const responseSuccess = (body) => {
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}

const responseCreatedSuccess = (body) => {
  return {
    statusCode: 201,
    body: JSON.stringify(body)
  }
}

const responseNotfound = (body) => {
  return {
    statusCode: 404,
    body: JSON.stringify({ statusCode: 404, message: body.message })
  }
}

const responseInternalError = (body) => {
  return {
    statusCode: 500,
    body: JSON.stringify({ statusCode: 500, message: body.message })
  }
}

export {
  responseSuccess,
  responseCreatedSuccess,
  responseNotfound,
  responseInternalError
}
