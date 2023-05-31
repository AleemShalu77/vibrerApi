
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

 getMessage = (body,to,from,subject) => {
  // const body = 'This is a test email using SendGrid from Node.js';
  return {
    to: to,
    from: from,
    subject: subject,
    text: body,
    html: `<strong>${body}</strong>`,
  };
}

render = (res, data) => {
  res.render("scan", { src: data })
}

module.exports = {
  send,
  render,
  getMessage
};

