const adminService = require('./adminService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const {validateAddUserReq,validateLoginReq,validateUpdateUserReq} = require("./adminValidation");

// const login = async(req,res,next) =>{
//   try {
//     if(!req.body || (Object.keys(req.body).length) === 0)
//       {
//           return next(createHttpError(400,{message:'Please pass body parameters'}));
//       }
//     let isValid = await validateLoginReq.validateAsync(req.body);
//     if(isValid instanceof Error){
//       return next(isValid)
//     }
//     let result = await adminService.login(req);
//     helper.send(res,result.code,result.data); 
//   } catch(error) {
//     if(error.isJoi){
//       return next(createHttpError(400,{message:error.message}));
//   }
//   next(error)
//  }
// }

const addUser= async (req, res, next) => {
  try {
    if(!req.body || (Object.keys(req.body).length) === 0)
      {
          return next(createHttpError(400,{message:'Please pass body parameters'}));
      } 
    let isValid = await validateAddUserReq.validateAsync(req.body);
    if(isValid instanceof Error){
      return next(isValid)
    }
    const name = req.body.first_name+ " "+ 'account'; 
    let result = await adminService.addUser(req);
    helper.send(res,result.code,result.data,"",name); 
  } catch(error) {
    if(error.isJoi){
      return next(createHttpError(400,{message:error.message}));
  }
  next(error)
 }
}

const updateUser = async(req, res, next) => {
  try {
    if(!req.body || (Object.keys(req.body).length) === 0)
      {
          return next(createHttpError(400,{message:'Please pass body parameters'}));
      } 
    let isValid = await validateUpdateUserReq.validateAsync(req.body);
    if(isValid instanceof Error){
      return next(isValid)
    }
    const name = req.body.first_name+ " "+ 'account'; 
    let result = await adminService.updateUser(req);
    helper.send(res,result.code,result.data,"",name); 
  } catch(error) {
    if(error.isJoi){
      return next(createHttpError(400,{message:error.message}));
  }
  next(error)
 }
}

const getAllUser = async(req, res, next) => {
  try {
    let result = await adminService.getAllUser(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

const getUser = async(req, res, next) => {
  try {
    let result = await adminService.getUser(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

const deleteUser = async(req, res, next) => {
  try {
    if(!req.params || (Object.keys(req.params).length) === 0)
    {
        return next(createHttpError(400,{message:'Please pass required parameters'}));
    }
    let result = await adminService.deleteUser(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

module.exports = {
    addUser,
    updateUser,
    getAllUser,
    getUser,
    deleteUser
    // login
}