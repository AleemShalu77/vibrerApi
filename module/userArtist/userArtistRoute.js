const userArtistController = require("./userArtistController");
const middleware = require("../../middleware")

module.exports = router => {
    router.post("/artist/login", middleware.validateToken, userArtistController.artistLogin);
    router.post("/artist/reset-password", middleware.validateToken, userArtistController.forgotPasswordArtist);
    router.post("/add/UserArtist", middleware.validateToken, userArtistController.addUserArtist);
    router.put("/update/UserArtist", middleware.validateToken, userArtistController.updateUserArtist);
    router.get("/all/UserArtist", middleware.validateToken, userArtistController.getAllUserArtist);
    router.get("/UserArtist/:id", middleware.validateToken, userArtistController.getUserArtist);
    router.post("/remove/UserArtist/:id", middleware.validateToken, userArtistController.deleteUserArtist);
}