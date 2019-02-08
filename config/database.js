if(process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds221155.mlab.com:21155/garagebuddy-prod`
  }
} else {
  module.exports = {
    mongoURI: `mongodb://localhost/garagebuddy-dev`
  }
}
