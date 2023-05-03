const adminRoute = require('../module/admin/adminRoute');
const artistCategoryRoute = require('../module/artistCategory/artistCategoryRoute');
const artistStatusRoute = require('../module/artistStatus/artistStatusRoute');
const badgeRoute = require('../module/badge/badgeRoute');
const coinPriceRoute = require('../module/coinPrice/coinPriceRoute');
const commentRoute = require('../module/comment/commentRoute');
const concertRoute = require('../module/concert/concertRoute');

module.exports = router => {
  adminRoute(router);
  artistCategoryRoute(router);
  artistStatusRoute(router);
  badgeRoute(router);
  coinPriceRoute(router);
  commentRoute(router);
  concertRoute(router);
  
    return router;
  }