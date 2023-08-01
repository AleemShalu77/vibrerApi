const typeSchema = require("../../model/type");

const addtype = async (req) => {
  const result = { data: null };
  const { name, status } = req.body;
  const typeCheck = await typeSchema.findOne({ name: name });
  if(typeCheck)
  {
    result.code = 205;
  }
  else
  {
  const type = await typeSchema.create({
    name: name,
    status: status
  })
  if (type) {
    result.data = type;
    result.code = 201;
  } else {
    result.code = 204;
  }
}
  return result;
}

const updatetype = async (req) => {
  const result = { data: null };
  const { id, name, status } = req.body;
  const filter = { _id: id };
  const typeCheck = await typeSchema.findOne({ name: name, _id: { $ne: id } });
  if(typeCheck)
  {
    result.code = 205;
  }
  else
  {
  const type = await typeSchema.updateOne(filter, {
    name: name,
    status: status
  }, {
    where: {
      _id: id
    }
  })
  if (type) {
    result.data = type;
    result.code = 202;
  } else {
    result.code = 204;
  }
}
  return result;
}

const getAlltype = async (req) => {
  const result = { data: null };
  const type = await typeSchema.find().sort({ createdAt: -1 });
  if (type) {
    result.data = type;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const gettype = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  try {
  const type = await typeSchema.findById(id)
  if (type) {
    result.data = type;
    result.code = 200;
  } else {
    result.code = 204;
  }
}
catch (error)
{
  result.code = 204;
}
  return result;
}

const deletetype = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const type = await typeSchema.findByIdAndRemove(id)
  if (type) {
    result.data = type;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {

  addtype,
  updatetype,
  getAlltype,
  gettype,
  deletetype
}