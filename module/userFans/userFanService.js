const userfansSchema = require("../../model/user_fans");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const nodemailer = require("nodemailer");
const { getMessage } = require('../../utils/helper');

const fanLogin = async (req) => {
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
    const user = await userfansSchema.findOne({ email });
    if (user) {
        // const match = await bcrypt.compare(password, user.password);
        const match = password;
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

const forgotPasswordfan = async (req) => {
    const result = { data: null };
    const { email, confirmPassword } = req.body;
    if (req.body.password != confirmPassword) {
        result.code = 2016;
        return result;
    }
    // const pswd = await bcrypt.genSalt(10);
    // const password = await bcrypt.hash(req.body.password, pswd);
    const password = req.body.password;
    const user = await userfansSchema.findOne({ email });
    if (user) {
        const reset = await userfansSchema.updateOne({ email: email }, {
            password: password
        })
        result.data = reset;
        result.code = 2015;
    } else {
        result.code = 2017;
    }
    return result
}

const addUserfan = async (req) => {
    const result = { data: null };
    const { email, first_name, last_name, fan_categories, city, state, country, concert_fan, visibility, chat, bio, profile_img, createdBy, blocked_user, following, votes, playlist, wallet_id, status } = req.body;
    // const password = await bcr
    ypt.hash(req.body.password, pswd);
    const password = req.body.password;
    const Userfan = await userfansSchema.create({
        email: email,
        password: password,
        fan_categories: fan_categories,
        first_name: first_name,
        last_name: last_name,
        city: city,
        state: state,
        country: country,
        concert_fan: concert_fan,
        visibility: visibility,
        chat: chat,
        bio: bio,
        profile_img: profile_img,
        blocked_user: blocked_user,
        following: following,
        votes: votes,
        playlist: playlist,
        wallet_id: wallet_id,
        createdBy: createdBy,
        status: status
    })
    if (Userfan) {
        result.data = Userfan;
        result.code = 201;
    } else {
        result.code = 204;
    }
    return result;
}

const updateUserfan = async (req) => {
    const result = { data: null };
    const { id, email, first_name, last_name, fan_categories, city, state, country, concert_fan, visibility, chat, bio, profile_img, createdBy, blocked_user, following, votes, playlist, wallet_id, status } = req.body;
    const filter = { _id: id };
    const Userfan = await userfansSchema.updateOne(filter, {
        email: email,
        fan_categories: fan_categories,
        first_name: first_name,
        last_name: last_name,
        city: city,
        state: state,
        country: country,
        concert_fan: concert_fan,
        visibility: visibility,
        chat: chat,
        bio: bio,
        profile_img: profile_img,
        blocked_user: blocked_user,
        following: following,
        votes: votes,
        playlist: playlist,
        wallet_id: wallet_id,
        createdBy: createdBy,
        status: status
    }, {
        where: {
            _id: id
        }
    })
    if (Userfan) {
        result.data = Userfan;
        result.code = 202;
    } else {
        result.code = 204;
    }
    return result;
}

const getAllUserfan = async (req) => {
    const result = { data: null };
    const Userfan = await userfansSchema.find()
    if (Userfan) {
        result.data = Userfan;
        result.code = 200;
    } else {
        result.code = 204;
    }
    return result;
}

const getUserfan = async (req) => {
    const result = { data: null };
    const id = req.params.id;
    const Userfan = await userfansSchema.findById(id)
    if (Userfan) {
        result.data = Userfan;
        result.code = 200;
    } else {
        result.code = 204;
    }
    return result;
}

const deleteUserfan = async (req) => {
    const result = { data: null };
    const id = req.params.id;
    const Userfan = await userfansSchema.findByIdAndRemove(id)
    if (Userfan) {
        result.data = Userfan;
        result.code = 203;
    } else {
        result.code = 204;
    }
    return result;
}

module.exports = {
    fanLogin,
    forgotPasswordfan,
    addUserfan,
    updateUserfan,
    getAllUserfan,
    getUserfan,
    deleteUserfan
}