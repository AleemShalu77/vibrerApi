const commentsSchema = require("../../model/comments");

const addComment = async(req) => {
  const result = {data : null};
  const { description,createdBy,status } = req.body;
  const comment = await commentsSchema.create({
    description:description,
    createdBy:createdBy,
    status:status
  })
  if(comment){
    result.data = comment;
    result.code = 201;
  }else{
    result.code = 204;
  }
  return result;
}

const updateComment = async(req) => {
  const result = {data : null};
  const { id,description ,createdBy,status } = req.body;
  const filter = { _id: id }; 
  const Comment = await commentsSchema.updateOne(filter, {
    description:description,
    createdBy:createdBy,
    status:status
  },{
    where:{
      _id:id
    }
  })
  if(Comment){
    result.data = Comment;
    result.code = 201;
  }else{
    result.code = 204;
  }
  return result;
}

const getAllComment = async(req)=>{
  const result = {data:null};
  const Comment = await commentsSchema.find()
  if(Comment){
    result.data = Comment;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const getComment = async(req)=>{
  const result = {data:null};
  const id = req.params.id;
  const user = await commentsSchema.findById(id)
  if(Comment){
    result.data = Comment;
    result.code = 200;
  }else{
    result.code = 204;
  }
  return result;
}

const deleteComment = async(req)=>{
  const result = {data:null};
  const id = req.params.id;
  const Comment = await commentsSchema.findByIdAndRemove(id)
  if(Comment){
    result.data = Comment;
    result.code = 203;
  }else{
    result.code = 204;
  }
  return result;
}

module.exports = {
    addComment,
    updateComment,
    getAllComment,
    getComment,
    deleteComment
}