const userFanService = require('./userFanService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddUserfanReq, validateUpdateUserfanReq,validateLoginReq,validateResetPasswordReq } = require("./userFanValidation");

const fanLogin = async(req,res,next) =>{
    try {
      if(!req.body || (Object.keys(req.body).length) === 0)
        {
            return next(createHttpError(400,{message:'Please pass body parameters'}));
        }
      let isValid = await validateLoginReq.validateAsync(req.body);
      if(isValid instanceof Error){
        return next(isValid)
      }
      let result = await userFanService.fanLogin(req);
      helper.send(res,result.code,result.data); 
    } catch(error) {
      if(error.isJoi){
        return next(createHttpError(400,{message:error.message}));
    }
    next(error)
   }
  }

const forgotPasswordfan = async(req,res,next) =>{
    try {
      if(!req.body || (Object.keys(req.body).length) === 0)
        {
            return next(createHttpError(400,{message:'Please pass body parameters'}));
        }
      let isValid = await validateResetPasswordReq.validateAsync(req.body);
      if(isValid instanceof Error){
        return next(isValid)
      }
      let result = await userFanService.forgotPasswordfan(req);
      helper.send(res,result.code,result.data); 
    } catch(error) {
      if(error.isJoi){
        return next(createHttpError(400,{message:error.message}));
    }
    next(error)
   }
  }
  

const addUserfan = async (req, res, next) => {
    try {
        if (!req.body || (Object.keys(req.body).length) === 0) {
            return next(createHttpError(400, { message: 'Please pass body parameters' }));
        }
        let isValid = await validateAddUserfanReq.validateAsync(req.body);
        if (isValid instanceof Error) {
            return next(isValid)
        }
        let result = await userFanService.addUserfan(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        if (error.isJoi) {
            return next(createHttpError(400, { message: error.message }));
        }
        next(error)
    }
}

const updateUserfan = async (req, res, next) => {
    try {
        if (!req.body || (Object.keys(req.body).length) === 0) {
            return next(createHttpError(400, { message: 'Please pass body parameters' }));
        }
        let isValid = await validateUpdateUserfanReq.validateAsync(req.body);
        if (isValid instanceof Error) {
            return next(isValid)
        }
        let result = await userFanService.updateUserfan(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        if (error.isJoi) {
            return next(createHttpError(400, { message: error.message }));
        }
        next(error)
    }
}

const getAllUserfan = async (req, res, next) => {
    try {
        let result = await userFanService.getAllUserfan(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        next(error)
    }
}

const getUserfan = async (req, res, next) => {
    try {
        let result = await userFanService.getUserfan(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        next(error)
    }
}

const deleteUserfan = async (req, res, next) => {
    try {
        let result = await userFanService.deleteUserfan(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        next(error)
    }
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