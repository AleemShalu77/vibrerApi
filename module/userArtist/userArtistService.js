const userArtistsSchema = require("../../model/user_artists");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const nodemailer = require("nodemailer");
const { getMessage } = require('../../utils/helper');

const artistLogin = async (req) => {
    let result = { data: null };
    // let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "abdul.aleem@techstalwarts.com", // generated ethereal user
            pass: "lhpexkpsstmysvue", // generated ethereal password
        },
    });
    const { email, password } = req.body;
    const user = await userArtistsSchema.findOne({ email });
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            let payload = {
                id: user.id,
                mobile: user.email,
                role: user.role
            };
            let options = { expiresIn: "72h" };
            let token = jwt.sign(payload, JWT_SECRET, options);
            let resObj = Object.assign({}, {
                role: user.role,
                email: user.email,
                token,
            });
            const bodyData = await getEmailVerification();
            const emailMessage = await getMessage(bodyData, 'aleem9860@gmail.com', 'aleem9860@gmail.com', 'Test Message');
            try {
                const send = await transporter.sendMail(emailMessage);
                console.log('Test email sent successfully');
            } catch (error) {
                console.error('Error sending test email');
                console.error(error);
                if (error.response) {
                    console.error(error.response.body)
                }
            }
            result.data = resObj;
            result.code = 2021;
        } else {
            result.code = 2019;
        }
    } else {
        result.code = 2017;
    }
    return result
}

const forgotPasswordArtist = async (req) => {
    const result = { data: null };
    const { email, confirmPassword } = req.body;
    if (req.body.password != confirmPassword) {
        result.code = 2016;
        return result;
    }
    const pswd = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, pswd);
    const user = await userArtistsSchema.findOne({ email });
    if (user) {
        const reset = await userArtistsSchema.updateOne({ email: email }, {
            password: password
        })
        result.data = reset;
        result.code = 2015;
    } else {
        result.code = 2017;
    }
    return result
}

const addUserArtist = async (req) => {
    const result = { data: null };
    const { email, username, artist_categories, first_name, last_name, city, state, country, concert_artist, visibility, chat, bio, profile_img, profile_cover, verified, badges, gallery_imgs, music_videos, music, facebook, twitter, sportify, instagram, youtube, website, blocked_user, followers, following, likes, liked, votes, playlist, blocked, wallet_id, status } = req.body;
    const password = await bcrypt.hash(req.body.password, pswd);
    const UserArtist = await userArtistsSchema.create({
        email: email,
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
    const { id, email, username, artist_categories, first_name, last_name, city, state, country, concert_artist, visibility, chat, bio, profile_img, profile_cover, verified, badges, gallery_imgs, music_videos, music, facebook, twitter, sportify, instagram, youtube, website, blocked_user, followers, following, likes, liked, votes, playlist, blocked, wallet_id, status } = req.body;
    const filter = { _id: id };
    const UserArtist = await userArtistsSchema.updateOne(filter, {
        email: email,
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
    artistLogin,
    forgotPasswordArtist,
    addUserArtist,
    updateUserArtist,
    getAllUserArtist,
    getUserArtist,
    deleteUserArtist
}