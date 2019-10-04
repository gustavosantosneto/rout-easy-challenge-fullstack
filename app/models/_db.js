module.exports = app => {
  const connection = connection_string => {
    try {
      app.mongoose.connect(connection_string, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })

      return app.mongoose.connection
    } catch (error) {
      console.error(error)
      reject(error)
    }
  }

  return {
    connection
  }
}
