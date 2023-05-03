const artistStatusSchema = require("../../model/artist_status");

const addArtistStatus = async(req) => {
  const result = {data : null};
  const { name,status } = req.body;
  const artist = await artistStatusSchema.create({
    name:name,
    status:status
  })
  if(artist){
    result.data = artist;  
    result.code = 201;
  }else{
    result.code = 204;
  }
  return result;
}

const updateArtistStatus = async(req) => {
  const result = {data : null};
  const { id,name,status } = req.body;
  const artist = await artistStatusSchema.updateOne(filter, {
    name:name,
    status:status
  },{
    where:{
      _id:id
    }
  })
  if(artist){
    result.data = artist;
    result.code = 202;
  }else{
    result.code = 204;
  }
  return result;
}

const getAllArtistStatus = async(req)=>{
  const result = {data:null};
  const artist = await artistStatusSchema.find()
  if(artist){
    result.data = artist;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const getArtistStatus = async(req)=>{
  const result = {data:null};
  const id = req.query;
  const artist = await artistStatusSchema.find({  
    where:{
      _id:id
    },
  })
  if(artist){
    result.data = artist;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const deleteArtistStatus = async(req)=>{
  const result = {data:null};
  const id = req.query;
  const artist = await artistStatusSchema.findOneAndRemove({
        where:{
          _id:id
        },
      })
      if(artist){
        result.data = artist;
        result.code = 203;
      }else{
        result.code = 204;
      }
      return result;
    }

  module.exports = {
      addArtistStatus,
      updateArtistStatus,
      getAllArtistStatus,
      getArtistStatus,
      deleteArtistStatus
  }