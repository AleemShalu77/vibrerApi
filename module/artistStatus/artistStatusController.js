const artistStatusService = require('./artistStatusService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddArtistReq,validateUpdateArtistReq} = require("./artistStatusValidation");

const addArtistStatus= async (req, res, next) => {
  try {
    if(!req.body || (Object.keys(req.body).length) === 0)
      {
          return next(createHttpError(400,{message:'Please pass body parameters'}));
      } 
    let isValid = await validateAddArtistReq.validateAsync(req.body);
    if(isValid instanceof Error){
      return next(isValid)
    }
    let result = await artistStatusService.addArtistStatus(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
    if(error.isJoi){
      return next(createHttpError(400,{message:error.message}));
  }
  next(error)
 }
}

const updateArtistStatus = async(req, res, next) => {
  try {
    if(!req.body || (Object.keys(req.body).length) === 0)
      {
          return next(createHttpError(400,{message:'Please pass body parameters'}));
      } 
    let isValid = await validateUpdateArtistReq.validateAsync(req.body);
    if(isValid instanceof Error){
      return next(isValid)
    }
    let result = await artistStatusService.updateArtistStatus(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
    if(error.isJoi){
      return next(createHttpError(400,{message:error.message}));
  }
  next(error)
 }
}

const getAllArtistStatus = async(req, res, next) => {
  try {
    let result = await artistStatusService.getAllArtistStatus(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

const getArtistStatus = async(req, res, next) => {
  try {
    if(!req.query || (Object.keys(req.query).length) === 0)
    {
        return next(createHttpError(400,{message:'Please pass query parameters'}));
    } 
    let result = await artistStatusService.getArtistStatus(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

const deleteArtistStatus = async(req, res, next) => {
  try {
    if(!req.query || (Object.keys(req.query).length) === 0)
    {
        return next(createHttpError(400,{message:'Please pass query parameters'}));
    }
    let result = await artistStatusService.deleteArtistStatus(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

module.exports = {
    addArtistStatus,
    updateArtistStatus,
    getAllArtistStatus,
    getArtistStatus,
    deleteArtistStatus
}