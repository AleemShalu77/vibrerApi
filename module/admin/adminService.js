const adminUsersSchema = require("../../model/admin_users");
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const { ADMIN_IMAGE_URL } = require("../../config/index")
const nodemailer = require("nodemailer");
require("dotenv").config();
const { getMessage } = require('../../utils/helper');
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const login = async (req) => {
  let result = { data: null };
  const { email, password } = req.body;
  let user = await adminUsersSchema.findOne({ email: email })
  if (user) {
    // const match = await bcrypt.compare(password, user.password);
    const match = await bcryptjs.compareSync(password, user.password);
    // const match = password;
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
      verification: user.verification,
      token,
    });
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

const forgotPassword = async (req) => {
  let result = { data: null };
  const {email,confirmPassword} = req.body;
  if(req.body.password != confirmPassword){
    result.code = 2016;
    return result;
  }
  // const pswd = await bcrypt.genSalt(10);
  // const password = await bcrypt.hash(req.body.password, pswd);
  const password = req.body.password;
  const admin = adminUsersSchema.findOneAndUpdate({ email: email })
  if(admin){
      const reset =  await adminUsersSchema.updateOne({ email: email },{
      password : password
    })
    result.data = reset;
    result.code = 2015;
  }else{
    result.code = 2017;
  }
  return result
}
const verificationCode = async (req) => {
  let result = { data: null };
  const {token} = req.body;

  try {
    const adminUser = await adminUsersSchema.findOne({ verification_token:token, verification:false });
    if (adminUser) {

        const updateToken =  await adminUsersSchema.updateOne(
            { _id: adminUser._id },
            { $set: { verification: true } }
        );

      if(updateToken)
      {
        result.code = 2023;
      }
      else
      {
        result.code = 500;
      }
        
    } else {
         result.code = 2022;
    }
} catch (error) {
    console.error('Error checking verification code:', error);
    result.code = 500;
}

  return result
}

const addUser = async (req) => {
  const result = { data: null };
  // const pswd = await bcrypt.genSalt(10);
  // const password = await bcrypt.hash(req.body.password, pswd);
  const password = await bcryptjs.hashSync(req.body.password, 10);
  // const password = req.body.password;
  const { first_name, last_name, role, email, verification, createdBy, updatedBy, status } = req.body;
  const profile_img = `${ADMIN_IMAGE_URL}` + `${req.file.filename}`
  const verification_token = generateRandomToken(50);

  const message = await getEmailVerification(email,verification_token);
  const messageData = await getMessage(message,email,process.env.EMAIL_FROM,'Vibrer Email Verification');
  
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_FROM, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  const adminCheck = await adminUsersSchema.findOne({ email: email });
  if(adminCheck)
  {
    result.code = 205;
  }
  else
  {
  
  const user = await adminUsersSchema.create({
    name: {
      first_name: first_name,
      last_name: last_name
    },
    role: role,
    email: email,
    password: password,
    verification: false,
    verification_token : verification_token,
    profile_img: profile_img,
    createdBy: createdBy,
    updatedBy: updatedBy,
    status: status
  })
  if (user) {
    try {
      // await sendGridMail.send(messageData);
        const send = await transporter.sendMail(messageData);
        } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
      }
    }
    result.data = user;
    result.code = 201;
  } else {
    result.code = 204;
  }
}
  return result;
}

const updateUser = async (req) => {
  const result = { data: null };
  const { id, first_name, last_name, role, email, verification, createdBy, updatedBy, status } = req.body;
  // const profile_img = `${ADMIN_IMAGE_URL}`+`${req.file}`
  const filter = { _id: id };

  const user = await adminUsersSchema.updateOne(filter, {
    name: {
      first_name: first_name,
      last_name: last_name
    },
    role: role,
    email: email,
    verification: verification,
    // profile_img:profile_img,
    // createdBy:createdBy,
    updatedBy: updatedBy,
    status: status
  })
  if (user) {
    result.data = user;
    result.code = 201;
  } else {
    result.code = 204;
  }
  return result;
}

const getAllUser = async (req) => {
  const result = { data: null };
  const user = await adminUsersSchema.find()
  if (user) {
    result.data = user;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getUser = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const user = await adminUsersSchema.findById(id)
  if (user) {
    result.data = user;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const deleteUser = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const user = await adminUsersSchema.findByIdAndRemove(id)
  if (user) {
    result.data = user;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}




module.exports = {
  login,
  forgotPassword,
  verificationCode,
  addUser,
  updateUser,
  getAllUser,
  getUser,
  deleteUser
}