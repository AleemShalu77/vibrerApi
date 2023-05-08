const contestTypeSchema = require("../../model/contest_type");
const contestSchema = require("../../model/contests")

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
  const filter = { _id: id }; 
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
  const id = req.params.id;
  const contestType = await contestTypeSchema.findById(id)
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
  const id = req.params.id;
  const contestType = await contestTypeSchema.findByIdAndRemove(id)
      if(contestType){
        result.data = contestType;
        result.code = 203;
      }else{
        result.code = 204;
      }
  return result;
}

const addContest = async(req) =>{
  const result = {data : null};
  const {contest_type,title,description,conditions,reward,time_zone,starts_on,ends_on,start_date,start_time,end_time,votes,winner,winner_second,winner_third,createdBy,updated_by,status} = req.body;
  const contest = await contestSchema.create({
    contest_type:contest_type,
    title:title,
    description:description,
    conditions:conditions,
    reward:reward,
    time_zone:time_zone,
    starts_on:starts_on,
    ends_on:ends_on,
    start_date:start_date,
    start_time:start_time,
    end_time:end_time,
    votes:votes,
    winner:winner,
    winner_second:winner_second,
    winner_third:winner_third,
    createdBy:createdBy,
    updated_by:updated_by,
    status:status
  })
  if(contest){
    result.data = contest
    result.code = 201;
  }else{
    result.code = 204;
  }
  return result;
}

const updateContest = async(req) => {
  const result = {data : null};
  const filter = { _id: id }; 
  const {contest_type,title,description,conditions,reward,time_zone,starts_on,ends_on,start_date,start_time,end_time,votes,winner,winner_second,winner_third,createdBy,updated_by,status} = req.body;
  const contest = await contestSchema.findOneAndUpdate(filter, {
    contest_type:contest_type,
    title:title,
    description:description,
    conditions:conditions,
    reward:reward,
    time_zone:time_zone,
    starts_on:starts_on,
    ends_on:ends_on,
    start_date:start_date,
    start_time:start_time,
    end_time:end_time,
    votes:votes,
    winner:winner,
    winner_second:winner_second,
    winner_third:winner_third,
    createdBy:createdBy,
    updated_by:updated_by,
    status:status
  })
  if(contest){
    result.data = contest
    result.code = 202;
  }else{
    result.code = 204;
  }
  return result;
}

const getAllContest = async(req) => {
  const result = {data : null};
  const contest = await contestSchema.find();
  if(contest){
    result.data = contest;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const getContest = async(req) => {
  const result = {data : null};
  const id = req.params.id;
  const contest = await contestSchema.findOne({_id:id});
  if(contest){
    result.data = contest;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const deleteContest = async(req) => {
  const result = {data : null};
  const id = req.params.id;
  const contest = await contestSchema.findOne({_id:id});
  if(contest){
    result.data = contest;
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
    deleteContestType,
    addContest,
    updateContest,
    getAllContest,
    getContest,
    deleteContest
  }