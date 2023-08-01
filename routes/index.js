const adminRoute = require('../module/admin/adminRoute');
const artistCategoryRoute = require('../module/artistCategory/artistCategoryRoute');
const artistStatusRoute = require('../module/artistStatus/artistStatusRoute');
const badgeRoute = require('../module/badge/badgeRoute');
const typeRoute = require('../module/type/typeRoute');
const coinPriceRoute = require('../module/coinPrice/coinPriceRoute');
const contestRoute = require('../module/contest/contestRoute');
const commentRoute = require('../module/comment/commentRoute');
const concertRoute = require('../module/concert/concertRoute');
const genreRoute = require('../module/genre/genreRoute')
const mediaPostRoute = require("../module/mediaPost/mediaPostRoute");
const platformCommissionRoute = require("../module/platformCommission/platformCommissionRoute");
const RoleRoute = require("../module/role/roleRoute");
const userArtistRoute = require("../module/userArtist/userArtistRoute");
const userFanRoute = require("../module/userFans/userFanRoute");
const verificationRoute = require("../module/verification/verificationRoute");
const virtualGiftRoute = require("../module/virtualGifts/virtualGiftsRoute");
// const walletRoute = require("../module/wallet/walletRoute");

module.exports = router => {
  adminRoute(router);
  artistCategoryRoute(router);
  artistStatusRoute(router);
  badgeRoute(router);
  typeRoute(router);
  coinPriceRoute(router);
  contestRoute(router);
  commentRoute(router);
  concertRoute(router);
  genreRoute(router)
  mediaPostRoute(router);
  platformCommissionRoute(router);
  RoleRoute(router);
  userArtistRoute(router);
  userFanRoute(router);
  verificationRoute(router);
  virtualGiftRoute(router);
  // walletRoute(router);

  return router;
}