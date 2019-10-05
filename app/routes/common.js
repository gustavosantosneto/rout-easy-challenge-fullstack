module.exports = app => {
  // LOG E FORMATO DE RETORNO PADRAO
  const response = (res, result) => {
    console.debug(result)
    if (result.error) res.status(result.code || 500).json(result)
    else res.status(result.code || 200).json(result)
  }

  return {
    response
  }
}
