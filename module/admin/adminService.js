const adminUsersSchema = require("../../model/admin_users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const { ADMIN_IMAGE_URL } = require("../../config/index")
const nodemailer = require("nodemailer");
const { getMessage } = require('../../utils/helper');




const login = async(req) =>{
  let testAccount = await nodemailer.createTestAccount();
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "abdul.aleem@techstalwarts.com", // generated ethereal user
    pass: "lhpexkpsstmysvue", // generated ethereal password
  },
});
  let result = { data: null };
  const { email, password } = req.body;
  let user = await adminUsersSchema.findOne({email:email })
  if(user) {
    const match = await bcrypt.compare(password, user.password);
    if(match) {
      let payload = {
        id: user.id,
        mobile: user.email,
        role: user.role
      };
      let options = { expiresIn: "72h" };
      let token = jwt.sign(payload, JWT_SECRET, options);
      let resObj = Object.assign({}, {
      role:user.role,
      email:user.email,
      verification:user.verification,
      token,
      });
      const bodyData = await getEmailVerification();
      const emailMessage = await getMessage(bodyData,'aleem9860@gmail.com','aleem9860@gmail.com','Test Message');
      try {
        const send =  await transporter.sendMail(emailMessage);
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

const addUser = async (req) => {
  const result = { data: null };
  const pswd = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, pswd);
  const { first_name, last_name, role, email, verification, createdBy, updatedBy, status } = req.body;
  const profile_img = `${ADMIN_IMAGE_URL}` + `${req.file.filename}`
  const user = await adminUsersSchema.create({
    name: {
      first_name: first_name,
      last_name: last_name
    },
    role: role,
    email: email,
    password: password,
    verification: verification,
    profile_img: profile_img,
    createdBy: createdBy,
    updatedBy: updatedBy,
    status: status
  })
  if (user) {
    // try {
    //   await sendGridMail.send(getMessage());
    //   console.log('Test email sent successfully');
    // } catch (error) {
    //   console.error('Error sending test email');
    //   console.error(error);
    //   if (error.response) {
    //     console.error(error.response.body)
    //   }
    // }
    result.data = user;
    result.code = 201;
  } else {
    result.code = 204;
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
  addUser,
  updateUser,
  getAllUser,
  getUser,
  deleteUser
}