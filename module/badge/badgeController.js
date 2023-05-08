const badgeService = require('./badgeService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddBadgeReq,validateUpdateBadgeReq} = require("./badgeValidation");

const addBadge= async (req, res, next) => {
  try {
    if(!req.body || (Object.keys(req.body).length) === 0)
      {
          return next(createHttpError(400,{message:'Please pass body parameters'}));
      } 
    let isValid = await validateAddBadgeReq.validateAsync(req.body);
    if(isValid instanceof Error){
      return next(isValid)
    }
    let result = await badgeService.addBadge(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
    if(error.isJoi){
      return next(createHttpError(400,{message:error.message}));
  }
  next(error)
 }
}

const updateBadge = async(req, res, next) => {
  try {
    if(!req.body || (Object.keys(req.body).length) === 0)
      {
          return next(createHttpError(400,{message:'Please pass body parameters'}));
      } 
    let isValid = await validateUpdateBadgeReq.validateAsync(req.body);
    if(isValid instanceof Error){
      return next(isValid)
    }
    let result = await badgeService.updateBadge(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
    if(error.isJoi){
      return next(createHttpError(400,{message:error.message}));
  }
  next(error)
 }
}

const getAllBadge = async(req, res, next) => {
  try {
    let result = await badgeService.getAllBadge(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

const getBadge = async(req, res, next) => {
  try {
    let result = await badgeService.getBadge(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

const deleteBadge = async(req, res, next) => {
  try {
    let result = await badgeService.deleteBadge(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

module.exports = {
    addBadge,
    updateBadge,
    getAllBadge,
    getBadge,
    deleteBadge
}