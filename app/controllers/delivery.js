module.exports = app => {
  const create = async data => {
    return new Promise(async (resolve, reject) => {
      try {
        console.debug({ data })

        if (!data) {
          console.error({ error: 'Parâmetro vazio' })
          return reject({ code: 400, data: null, error: 'Parâmetro vazio' })
        } else if (!data.customer_name) {
          console.error({ error: 'Sem nome' })
          return reject({ code: 400, data: null, error: 'Sem nome do cliente' })
        }

        new app.models.delivery.model(data)
          .save()
          .then(result => {
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      } catch (err) {
        console.error(err.stack || err)
        reject({ code: 500, data: null, error: 'Erro não esperado' })
      }
    })
  }

  const get_all = async => {
    return new Promise(async (resolve, reject) => {
      try {
        app.models.delivery.model
          .find()
          .then(result => {
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      } catch (err) {
        console.error(err.stack || err)
        reject({ code: 500, data: null, error: 'Erro não esperado' })
      }
    })
  }

  const delete_delivery = async => {
    return new Promise(async (resolve, reject) => {
      try {
        app.models.delivery.model
          .deleteMany()
          .then(result => {
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      } catch (err) {
        console.error(err.stack || err)
        reject({ code: 500, data: null, error: 'Erro não esperado' })
      }
    })
  }

  const search_address_google = async address_string => {
    // return new Promise(async (resolve, reject) => {
    try {
      const options = {
        json: true,
        method: 'GET',
        uri: `https://maps.googleapis.com/maps/api/geocode/json?address=${address_string}&key=${process.env.GOOGLE_API_KEY}`
      }

      console.debug(options.uri)

      const result = await app
        .rp(options)
        .then(async parsedBody => {
          return {
            code: 200,
            data: parsedBody,
            error: null
          }
        })
        .catch(async err => {
          console.error(err.stack)

          return {
            code: 500,
            data: null,
            error: err.message
          }
        })

      // resolve(result)
      return result
    } catch (err) {
      console.error(err.stack || err)
      // reject({ code: 500, data: null, error: 'Erro não esperado' })
      return { code: 500, data: null, error: 'Erro não esperado' }
    }
    // })
  }

  return {
    create,
    get_all,
    delete_delivery,
    search_address_google
  }
}
