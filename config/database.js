if(process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: `mongodb://bstrahilov:<dbpassword>@ds221155.mlab.com:21155/garagebuddy-prod`
  }
} else {
  module.exports = {
    mongoURI: `mongodb://localhost/garagebuddy-dev`
  }
}