const generatePaginateOptions = (params) => {
  return {
    limit: params.limit ? +params.limit : 10,
    page: params.page ? +params.page : 1,
    sort: params.sort || '-createdAt',
    select: params.select,
    lean: true,
    leanWithId: false
  }
}

export { generatePaginateOptions }
