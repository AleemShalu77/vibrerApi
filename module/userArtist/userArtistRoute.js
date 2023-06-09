const userArtistController = require("./userArtistController");

module.exports = router => {
    router.post("/artist/login", userArtistController.artistLogin);
    router.post("/artist/reset-password", userArtistController.forgotPasswordArtist);
    router.post("/add/UserArtist", userArtistController.addUserArtist);
    router.put("/update/UserArtist", userArtistController.updateUserArtist);
    router.get("/all/UserArtist", userArtistController.getAllUserArtist);
    router.get("/UserArtist/:id", userArtistController.getUserArtist);
    router.post("/remove/UserArtist/:id", userArtistController.deleteUserArtist);
}