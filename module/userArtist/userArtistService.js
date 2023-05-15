const userArtistsSchema = require("../../model/user_artists");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../../config");

const addUserArtist = async (req) => {
    const result = { data: null };
    const { eamil, username, artist_categories, first_name, last_name, city, state, country, concert_artist, visibility, chat, bio, profile_img, profile_cover, verified, badges, gallery_imgs, music_videos, music, facebook, twitter, sportify, instagram, youtube, website, blocked_user, followers, following, likes, liked, votes, playlist, blocked, wallet_id, status } = req.body;
    const password = await bcrypt.hash(req.body.password, pswd);
    const UserArtist = await userArtistsSchema.create({
        eamil: eamil,
        password: password,
        username: username,
        artist_categories: artist_categories,
        first_name: first_name,
        last_name: last_name,
        city: city,
        state: state,
        country: country,
        concert_artist: concert_artist,
        visibility: visibility,
        chat: chat,
        bio: bio,
        profile_img: profile_img,
        profile_cover: profile_cover,
        verified: verified,
        badges: badges,
        gallery_imgs: gallery_imgs,
        music_videos: music_videos,
        music: music,
        facebook: facebook,
        twitter: twitter,
        sportify: sportify,
        instagram: instagram,
        youtube: youtube,
        website: website,
        blocked_user: blocked_user,
        followers: followers,
        following: following,
        likes: likes,
        liked: liked,
        votes: votes,
        playlist: playlist,
        blocked: blocked,
        wallet_id: wallet_id,
        status: status
    })
    if (UserArtist) {
        result.data = UserArtist;
        result.code = 201;
    } else {
        result.code = 204;
    }
    return result;
}

const updateUserArtist = async (req) => {
    const result = { data: null };
    const { id, eamil, username, artist_categories, first_name, last_name, city, state, country, concert_artist, visibility, chat, bio, profile_img, profile_cover, verified, badges, gallery_imgs, music_videos, music, facebook, twitter, sportify, instagram, youtube, website, blocked_user, followers, following, likes, liked, votes, playlist, blocked, wallet_id, status } = req.body;
    const filter = { _id: id };
    const UserArtist = await userArtistsSchema.updateOne(filter, {
        eamil: eamil,
        username: username,
        artist_categories: artist_categories,
        first_name: first_name,
        last_name: last_name,
        city: city,
        state: state,
        country: country,
        concert_artist: concert_artist,
        visibility: visibility,
        chat: chat,
        bio: bio,
        profile_img: profile_img,
        profile_cover: profile_cover,
        verified: verified,
        badges: badges,
        gallery_imgs: gallery_imgs,
        music_videos: music_videos,
        music: music,
        facebook: facebook,
        twitter: twitter,
        sportify: sportify,
        instagram: instagram,
        youtube: youtube,
        website: website,
        blocked_user: blocked_user,
        followers: followers,
        following: following,
        likes: likes,
        liked: liked,
        votes: votes,
        playlist: playlist,
        blocked: blocked,
        wallet_id: wallet_id,
        status: status
    }, {
        where: {
            _id: id
        }
    })
    if (UserArtist) {
        result.data = UserArtist;
        result.code = 202;
    } else {
        result.code = 204;
    }
    return result;
}

const getAllUserArtist = async (req) => {
    const result = { data: null };
    const UserArtist = await userArtistsSchema.find()
    if (UserArtist) {
        result.data = UserArtist;
        result.code = 200;
    } else {
        result.code = 204;
    }
    return result;
}

const getUserArtist = async (req) => {
    const result = { data: null };
    const id = req.params.id;
    const UserArtist = await userArtistsSchema.findById(id)
    if (UserArtist) {
        result.data = UserArtist;
        result.code = 200;
    } else {
        result.code = 204;
    }
    return result;
}

const deleteUserArtist = async (req) => {
    const result = { data: null };
    const id = req.params.id;
    const UserArtist = await userArtistsSchema.findByIdAndRemove(id)
    if (UserArtist) {
        result.data = UserArtist;
        result.code = 203;
    } else {
        result.code = 204;
    }
    return result;
}

module.exports = {
    addUserArtist,
    updateUserArtist,
    getAllUserArtist,
    getUserArtist,
    deleteUserArtist
}