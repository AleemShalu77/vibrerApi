const adminRoute = require("../module/admin/adminRoute");
const artistCategoryRoute = require("../module/artistCategory/artistCategoryRoute");
const contestRoute = require("../module/contest/contestRoute");
const genreRoute = require("../module/genre/genreRoute");
const mediaPostRoute = require("../module/mediaPost/mediaPostRoute");
const appUserRoute = require("../module/appUsers/appUserRoute");
const reportRoute = require("../module/report/reportRoute");
const contestTypeRoute = require("../module/contestType/contestTypeRoute");

module.exports = (router) => {
  adminRoute(router);
  artistCategoryRoute(router);
  contestRoute(router);
  genreRoute(router);
  mediaPostRoute(router);
  appUserRoute(router);
  reportRoute(router);
  contestTypeRoute(router);

  return router;
};
