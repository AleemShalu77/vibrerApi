const genreSchema = require("../../model/genre");

const addGenre = async (req) => {
  const result = { data: null };
  const { name, status } = req.body;
  const genre = await genreSchema.create({
    name: name,
    status: status
  })
  if (genre) {
    result.data = genre;
    result.code = 201;
  } else {
    result.code = 204;
  }
  return result;
}

const updateGenre = async (req) => {
  const result = { data: null };
  const { id, name, status } = req.body;
  const filter = { _id: id };
  const genre = await genreSchema.updateOne(filter, {
    name: name,
    status: status
  }, {
    where: {
      _id: id
    }
  })
  if (genre) {
    result.data = genre;
    result.code = 202;
  } else {
    result.code = 204;
  }
  return result;
}

const getAllGenre = async (req) => {
  const result = { data: null };
  const genre = await genreSchema.find()
  if (genre) {
    result.data = genre;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getGenre = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const genre = await genreSchema.findById(id)
  if (genre) {
    result.data = genre;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const deleteGenre = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const genre = await genreSchema.findByIdAndRemove(id)
  if (genre) {
    result.data = genre;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {

  addGenre,
  updateGenre,
  getAllGenre,
  getGenre,
  deleteGenre
}