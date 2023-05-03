const adminUsersSchema = require("../../model/admin_users");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../../config");
const { ADMIN_IMAGE_URL } = require("../../config/index")

const addUser = async(req) => {
  const result = {data : null};
  const pswd = await bcrypt.genSalt(10); 
  const password = await bcrypt.hash(req.body.password , pswd);
  const { first_name, last_name ,role,email,verification,createdBy,updatedBy,status } = req.body;
  const profile_img = `${ADMIN_IMAGE_URL}`+`${req.file}`
  const user = await adminUsersSchema.create({
    name:{
        first_name: first_name,
        last_name:last_name
    },
    role:role,
    email:email,
    password:password,
    verification:verification,
    profile_img:profile_img,
    createdBy:createdBy,
    updatedBy:updatedBy,
    status:status
  })
  if(user){
    result.data = user;
    result.code = 201;
  }else{
    result.code = 204;
  }
  return result;
}

const updateUser = async(req) => {
  const result = {data : null};
  const { id,first_name, last_name ,role,email,verification,createdBy,updatedBy,status } = req.body;
  // const profile_img = `${ADMIN_IMAGE_URL}`+`${req.file}`
  const user = await adminUsersSchema.updateOne(filter, {
    name:{
        first_name: first_name,
        last_name:last_name
    },
    role:role,
    email:email,
    verification:verification,
    // profile_img:profile_img,
    createdBy:createdBy,
    updatedBy:updatedBy,
    status:status
  },{
    where:{
      _id:id
    }
  })
  if(user){
    result.data = user;
    result.code = 201;
  }else{
    result.code = 204;
  }
  return result;
}

const getAllUser = async(req)=>{
  const result = {data:null};
  const user = await adminUsersSchema.find()
  if(user){
    result.data = user;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const getUser = async(req)=>{
  const result = {data:null};
  const id = req.query;
  const user = await adminUsersSchema.find({  
    where:{
      _id:id
    },
  })
  if(user){
    result.data = user;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const deleteUser = async(req)=>{
  const result = {data:null};
  const id = req.query;
  const user = await adminUsersSchema.findOneAndRemove({
    where:{
      _id:id
    },
  })
  if(user){
    result.data = user;
    result.code = 203;
  }else{
    result.code = 204;
  }
  return result;
}

// const login = async(req) =>{
//   let result = { data: null };
//   const { email, password } = req.body;
//   let user = await adminUsersSchema.findOne({
//     where: {
//       email:email
//     },
//     attributes:['password']
//   })
//   console.log(user);
//   if(user) {
//     const match = await bcrypt.compare(password, user.password);
    
//     if(match) {
//       let payload = {
//         id: user.id,
//         mobile: user.email,
//         role: user.role
//       };
//       let options = { expiresIn: "72h" };
//       let token = jwt.sign(payload, JWT_SECRET, options);
//       let resObj = Object.assign({}, {
//       name:{
//           first_name: first_name,
//           last_name:last_name
//       },
//       role:role,
//       email:email,
//       verification:verification,
//       profile_img:profile_img,
//       token,
//       });
//       result.data = resObj;
//       result.code = 2021;
//     } else {
//       result.code = 2019;
//     }
//   } else {
//     result.code = 2017;
//   }
//   return result
// }
  

module.exports = {
    // login,
    addUser,
    updateUser,
    getAllUser,
    getUser,
    deleteUser
}