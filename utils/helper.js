
send = (res, code, data , msg = "", customMsg = "",totalRecords) => {
  let result = {};
  const m = require("./msgs")[code];
  result.status = m ? m.status : code;
  result.message = msg ? msg : m ? m.message : "";
  result.message = customMsg ? customMsg +" "+ result.message : result.message;
  result.result = data;
  if (totalRecords) result.totalRecords = totalRecords;
  res.status(m ? m.httpCode : code).json(result);
};

render = (res, data) => {
  res.render("scan", { src: data })
}

module.exports = {
  send,
  render,
};

