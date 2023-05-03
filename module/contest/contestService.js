const contestTypeSchema = require("../../model/contest_type");

const addContestType = async(req) => {
  const result = {data : null};
  const { name,status } = req.body;
  const contestType = await contestTypeSchema.create({
    name:name,
    status:status
  })
  if(contestType){
    result.data = contestType;  
    result.code = 201;
  }else{
    result.code = 204;
  }
  return result;
}

const updateContestType = async(req) => {
  const result = {data : null};
  const { id,name,status } = req.body;
  const contestType = await contestTypeSchema.updateOne(filter, {
    name:name,
    status:status
  },{
    where:{
      _id:id
    }
  })
  if(contestType){
    result.data = contestType;
    result.code = 202;
  }else{
    result.code = 204;
  }
  return result;
}

const getAllContestType = async(req)=>{
  const result = {data:null};
  const contestType = await contestTypeSchema.find()
  if(contestType){
    result.data = contestType;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const getContestType = async(req)=>{
  const result = {data:null};
  const id = req.query;
  const contestType = await contestTypeSchema.find({  
    where:{
      _id:id
    },
  })
  if(contestType){
    result.data = contestType;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const deleteContestType = async(req)=>{
  const result = {data:null};
  const id = req.query;
  const contestType = await contestTypeSchema.findOneAndRemove({
        where:{
          _id:id
        },
      })
      if(contestType){
        result.data = contestType;
        result.code = 203;
      }else{
        result.code = 204;
      }
      return result;
    }

module.exports = {
    addContestType,
    updateContestType,
    getAllContestType,
    getContestType,
    deleteContestType
  }