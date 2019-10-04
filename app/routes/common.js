module.exports = app => {
  const response = (res, result) => {
    console.debug(result)
    if (result.error) res.status(result.code || 500).json(result)
    else res.status(result.code || 200).json(result)
  }

  return {
    response
  }
}
