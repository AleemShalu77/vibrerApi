const concertTypeSchema = require("../../model/concert_type");
const {CONCERT_TYPE_ICON_URL } = require("../../config/index")

const addConcertType = async(req) => {
  const result = {data : null};
  const { name,status } = req.body;
  const icon_img = `${CONCERT_TYPE_ICON_URL}`+`${req.file}`
  const concertType = await concertTypeSchema.create({
    name:name,
    icon:icon_img,
    status:status
  })
  if(concertType){
    result.data = concertType;  
    result.code = 201;
  }else{
    result.code = 204;
  }
  return result;
}

const updateConcertType = async(req) => {
  const result = {data : null};
  const { id,name,status } = req.body;
//   const icon_img = `${CONCERT_TYPE_ICON_URL}`+`${req.file}`
  const concertType = await concertTypeSchema.updateOne(filter, {
    name:name,
    icon:icon_img,
    status:status
  },{
    where:{
      _id:id
    }
  })
  if(concertType){
    result.data = concertType;
    result.code = 202;
  }else{
    result.code = 204;
  }
  return result;
}

const getAllConcertType = async(req)=>{
  const result = {data:null};
  const concertType = await concertTypeSchema.find()
  if(concertType){
    result.data = concertType;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const getConcertType = async(req)=>{
  const result = {data:null};
  const id = req.query;
  const concertType = await concertTypeSchema.find({  
    where:{
      _id:id
    },
  })
  if(concertType){
    result.data = concertType;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const deleteConcertType = async(req)=>{
  const result = {data:null};
  const id = req.query;
  const concertType = await concertTypeSchema.findOneAndRemove({
        where:{
          _id:id
        },
      })
      if(concertType){
        result.data = concertType;
        result.code = 203;
      }else{
        result.code = 204;
      }
      return result;
    }

module.exports = {
    addConcertType,
    updateConcertType,
    getAllConcertType,
    getConcertType,
    deleteConcertType
  }