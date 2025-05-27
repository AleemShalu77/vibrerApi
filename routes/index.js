const adminRoute = require("../module/admin/adminRoute");
const artistCategoryRoute = require("../module/artistCategory/artistCategoryRoute");
const badgeRoute = require("../module/badge/badgeRoute");
const typeRoute = require("../module/type/typeRoute");
const coinPriceRoute = require("../module/coinPrice/coinPriceRoute");
const contestRoute = require("../module/contest/contestRoute");
const commentRoute = require("../module/comment/commentRoute");
const genreRoute = require("../module/genre/genreRoute");
const mediaPostRoute = require("../module/mediaPost/mediaPostRoute");
const appUserRoute = require("../module/appUsers/appUserRoute");
const projectRoute = require("../module/project/projectRoute");
const notifyRoute = require("../module/notify/notifyRoute");
const reportRoute = require("../module/report/reportRoute");
const r2DirectRoute = require("../module/mediaPost/r2Direct");
const r2bulkVideosRoute = require("../module/mediaPost/r2bulkVideos");
// const walletRoute = require("../module/wallet/walletRoute");

module.exports = (router) => {
  adminRoute(router);
  artistCategoryRoute(router);
  badgeRoute(router);
  typeRoute(router);
  coinPriceRoute(router);
  contestRoute(router);
  commentRoute(router);
  genreRoute(router);
  mediaPostRoute(router);
  appUserRoute(router);
  projectRoute(router);
  notifyRoute(router);
  reportRoute(router);
  r2DirectRoute(router);
  r2bulkVideosRoute(router);

  return router;
};
