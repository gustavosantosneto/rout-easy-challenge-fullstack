module.exports = app => {
  const conn = app.models._db.connection(process.env.MONGODB_CONNECTION_STRING)

  const delivery_schema = new app.mongoose.Schema(
    {
      data_criacao: { type: Date, default: Date.now },

      nome_cliente: { type: String, default: '' },
      peso_kg: { type: Number, default: 0 },

      endereco: {
        complemento: { type: String, default: '' },
        numero: { type: Number, default: 0 },
        logradouro: { type: String, default: '' },
        bairro: { type: String, default: '' },
        cidade: { type: String, default: '' },
        estado: { type: String, default: '' },
        pais: { type: String, default: '' },
        geo_localizacao: {
          latitude: { type: Number, default: 0 },
          longitude: { type: Number, default: 0 }
        }
      }
    },
    {
      collection: 'deliveries',
      versionKey: false
    }
  )

  let model = conn.model('deliveries', delivery_schema)

  return {
    model
    //insert
  }
}
