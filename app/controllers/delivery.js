module.exports = app => {
  const create = async data => {
    return new Promise(async (resolve, reject) => {
      try {
        console.debug({ data })

        if (!data) {
          console.error({ error: 'Parâmetro vazio' })
          return reject({ code: 400, data: null, error: 'Parâmetro vazio' })
        } else if (!data.nome_cliente) {
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
            resolve({ code: 200, error: null, data: result })
          })
          .catch(err => {
            console.error(err.stack || err)
            reject({ code: 500, error: 'Falha ao buscar dados', data: null })
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
    try {
      let addr = await google_geo_api(address_string)
      console.debug(JSON.stringify(addr))

      if (addr.error || addr.data.status !== 'OK' || addr.data.results.length === 0 || address_string === 'teste error')
        return { code: 500, data: null, error: 'Falha ao buscar endereço' }

      // DECIDI NAO COMPLICAR MOSTRANDO MAIS DE UMA OPCAO, SEMPRE PEGANDO A PRIMEIRA
      addr = addr.data.results[0]

      // SIMPLIFICA O FORMATO DO RETORNO PARA UM OBJ
      addr.obj = addr.address_components.reduce((obj, item) => {
        obj[item.types[0]] = item.long_name
        return obj
      }, {})

      if (!addr.obj.route) return { code: 500, data: null, error: 'Endereço sem logradouro' }

      console.debug(JSON.stringify(addr))

      const result = {
        address: addr.formatted_address,
        geo_localizacao: {
          latitude: addr.geometry.location.lat,
          longitude: addr.geometry.location.lng
        },
        pais: addr.obj.country,
        estado: addr.obj.administrative_area_level_1,
        cidade: addr.obj.administrative_area_level_2,
        bairro: addr.obj.political,
        logradouro: addr.obj.route,
        numero: addr.obj.street_number
      }

      return {
        code: 200,
        data: result,
        error: null
      }
    } catch (err) {
      console.error(err.stack || err)

      return { code: 500, data: null, error: 'Erro não esperado' }
    }
  }

  const google_geo_api = async address_string => {
    try {
      const options = {
        json: true,
        method: 'GET',
        uri: 'https://maps.googleapis.com/maps/api/geocode/json',
        qs: {
          address: address_string,
          region: 'br',
          language: 'pt-BR',
          key: process.env.GOOGLE_API_KEY
        }
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

      return result
    } catch (err) {
      console.error(err.stack || err)
      return { code: 500, data: null, error: 'Erro não esperado' }
    }
  }

  return {
    create,
    get_all,
    delete_delivery,
    search_address_google
  }
}
