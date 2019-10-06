module.exports = app => {
  //POR TER APENAS UMA PAGINA, REDIRECIONA HOME PARA ELA
  app.get('/', async (req, res) => res.redirect(307, '/deliveries/home'))

  app.get('/deliveries/home', (req, res) => {
    res.render('delivery')
  })

  app.get('/deliveries', async (req, res) => {
    const result = await app.controllers.delivery.get_all().catch()

    return app.routes.common.response(res, result)
  })

  app.post('/deliveries', async (req, res) => {
    const result = await app.controllers.delivery.create(req.body).catch()

    return app.routes.common.response(res, result)
  })

  app.delete('/deliveries', async (req, res) => {
    const result = await app.controllers.delivery.delete_all_deliveries().catch()

    return app.routes.common.response(res, result)
  })

  app.delete('/deliveries/:id', async (req, res) => {
    const result = await app.controllers.delivery.delete_delivery(req.params.id).catch()

    return app.routes.common.response(res, result)
  })

  app.get('/deliveries/search_address/:addres_string', async (req, res) => {
    const result = await app.controllers.delivery.search_address_google(req.params.addres_string).catch()

    return app.routes.common.response(res, result)
  })
}
