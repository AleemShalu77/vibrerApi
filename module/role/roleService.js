const rolesSchema = require("../../model/roles");

const addrole = async (req) => {
  const result = { data: null };
  const { name, status } = req.body;
  const role = await rolesSchema.create({
    name: name,
    status: status
  })
  if (role) {
    result.data = role;
    result.code = 201;
  } else {
    result.code = 204;
  }
  return result;
}

const updaterole = async (req) => {
  const result = { data: null };
  const { id, name, status } = req.body;
  const filter = { _id: id };
  const role = await rolesSchema.updateOne(filter, {
    name: name,
    status: status
  }, {
    where: {
      _id: id
    }
  })
  if (role) {
    result.data = role;
    result.code = 202;
  } else {
    result.code = 204;
  }
  return result;
}

const getAllrole = async (req) => {
  const result = { data: null };
  const role = await rolesSchema.find()
  if (role) {
    result.data = role;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getrole = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const role = await rolesSchema.findById(id)
  if (role) {
    result.data = role;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const deleterole = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const role = await rolesSchema.findByIdAndRemove(id)
  if (role) {
    result.data = role;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {
  addrole,
  updaterole,
  getAllrole,
  getrole,
  deleterole
}