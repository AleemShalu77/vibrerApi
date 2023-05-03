require("dotenv").config();
module.exports = {
  SWAGGER_DEFINATION: {
    info: {
      title: 'Swagger API',
      version: '1.0.0',
      description: 'Endpoints to test the APIs',
    },
    host: process.env.SWAGGER_HOST,
    basePath: '/',
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'authorization',
        scheme: 'JWT',
        in: 'header',
      },
    },
  },

  HOST: process.env.HOST,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  
  //image
  ADMIN_IMAGE_URL: process.env.admin_url,
  ARTIST_CATEGORY_ICON_URL : process.env.artistCategoryIcon_url,
  BADGE_ICON_URL:process.env.badgeIcon_url,
  COIN_PRICE_ICON_URL:process.env.coinPriceIcon_url,
  CONCERT_TYPE_ICON_URL:process.env.concertTypeIcon_url

}
