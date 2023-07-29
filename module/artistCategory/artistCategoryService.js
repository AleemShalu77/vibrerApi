const artistCategoriesSchema = require("../../model/artist_categories");

const addartistCategory = async (req) => {
  const result = { data: null };
  const { name, status } = req.body;
  const categoryCheck = await artistCategoriesSchema.findOne({ name: name });
  if(categoryCheck)
  {
    result.code = 205;
    return result; // Return immediately if category already exists
  }
  else
  {
  const artist = await artistCategoriesSchema.create({
    name: name,
    status: status
  })
  if (artist) {
    result.data = artist;
    result.code = 201;
  } else {
    result.code = 204;
  }
  return result;
}
 
}

const updateartistCategory = async (req) => {
  const result = { data: null };
  const { id, name, status } = req.body;
  const filter = { _id: id };
  const categoryCheck = await artistCategoriesSchema.findOne({ name: name, _id: { $ne: id } });
  if(categoryCheck)
  {
    result.code = 205;
  }
  else
  {
  const artist = await artistCategoriesSchema.updateOne(filter, {
    name: name,
    status: status
  }, {
    where: {
      _id: id
    }
  })
  if (artist) {
    result.data = artist;
    result.code = 202;
  } else {
    result.code = 204;
  }
}
  return result;
}

const getAllartistCategory = async (req) => {
  const result = { data: null };
  const artist = await artistCategoriesSchema.find().sort({ createdAt: -1 });
  if (artist) {
    result.data = artist;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getartistCategory = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  try {
  const artist = await artistCategoriesSchema.findById(id)
  if (artist) {
    result.data = artist;
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

const deleteartistCategory = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const artist = await artistCategoriesSchema.findByIdAndRemove(id)
  if (artist) {
    result.data = artist;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {

  addartistCategory,
  updateartistCategory,
  getAllartistCategory,
  getartistCategory,
  deleteartistCategory
}