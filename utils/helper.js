
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

generateRandomToken = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let token = '';
  
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      token += characters.charAt(randomIndex);
  }
  
  return token;
};

getEmailVerification = (email,verification_token) => {
  let data = `<!DOCTYPE html>
  <html lang="en" style="margin: 0; padding: 0; overflow-x: hidden; box-sizing: border-box;">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>E-MAIL VERIFICATION</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway:500,700&display=swap" rel="stylesheet">
  </head>
  
  <body style="margin: 0; padding: 0; overflow-x: hidden; box-sizing: border-box; background-color: #444;">
    <section class="container" style="display: grid; justify-content: center;">
      <div class="template-wrapper" style="background-color: #fff; width: 100%;">
        <!--div class="row" style="width: 100%; display: flex;">
          <div class="text-center col logo" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; background: #f4f4f4; border: solid 1px #e4e4e4; padding: 30px 10px;">
            <img src="https://vibrer.cloud/public/images/viberer-logo-light.svg" alt="Hello Worker Logo" style="width: 200px;">
          </div>
        </div-->
        <div class="row" style="width: 100%; display: flex;">
          <div class="col text-center resPW" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; background-color: #ff5d5d; padding: 30px 10px;">
            <h1 style="font-family: sans-serif; color: #ffffff; font-weight: 700; font-size: 1rem; margin: 0; text-transform: uppercase;">
            E-MAIL VERIFICATION
            </h1>
          </div>
        </div>
        <div class="row" style="width: 100%; display: flex;">
          <div class="col content" style="width: 100%; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 15px;">
            <h3 style="margin: 0; font-family: sans-serif; font-size: 1.1rem; color: #3f3d56; margin-bottom: 8px;">
            Dear `+email+`</h3>
            <p style="margin: 0; font-family: sans-serif; line-height: 1.5; color: #ff5d5d; font-size: 1.3rem;">
            you have successfully registered
            </p>
          </div>
        </div>
        
  
        <div class="row" style="width: 100%; display: flex;">
          <div class="col content" style="width: 100%; padding-left: 30px; padding-right: 30px; padding-top: 15px; padding-bottom: 30px;">
  
            <p style="margin: 0; font-size: 15px; color: #3f3d56; font-family: sans-serif; line-height: 2;">
            To verify your email <a style="color: #0369ee;" href="https://vibrer.cloud/email-verification?token=`+verification_token+`">Click
            Here</a><br>
            Thank you for using the Vibrer.
            </p>
          </div>
        </div>
        <div class="row" style="width: 100%; display: flex;">
          <div class="col footer text-center" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; padding: 30px 10px; background-color: #3f3d56; margin-top: 15px;">
            <p style="margin: 0; font-family: sans-serif; line-height: 1.5; color: #e9e8e8; font-size: 14px;">©
              2023 Vibrer</p>
          </div>
        </div>
      </div>
    </section>
  </body>
  
  </html>`;

  return data;
}

getForgotPassword = (email,verification_token) => {
  let data = `<!DOCTYPE html>
  <html lang="en" style="margin: 0; padding: 0; overflow-x: hidden; box-sizing: border-box;">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Forgot Password</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway:500,700&display=swap" rel="stylesheet">
  </head>
  
  <body style="margin: 0; padding: 0; overflow-x: hidden; box-sizing: border-box; background-color: #444;">
    <section class="container" style="display: grid; justify-content: center;">
      <div class="template-wrapper" style="background-color: #fff; width: 100%;">
        <!--div class="row" style="width: 100%; display: flex;">
          <div class="text-center col logo" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; background: #f4f4f4; border: solid 1px #e4e4e4; padding: 30px 10px;">
            <img src="https://vibrer.cloud/public/images/viberer-logo-light.svg" alt="Hello Worker Logo" style="width: 200px;">
          </div>
        </div-->
        <div class="row" style="width: 100%; display: flex;">
          <div class="col text-center resPW" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; background-color: #ff5d5d; padding: 30px 10px;">
            <h1 style="font-family: sans-serif; color: #ffffff; font-weight: 700; font-size: 1rem; margin: 0; text-transform: uppercase;">
            Reset Password
            </h1>
          </div>
        </div>
        <div class="row" style="width: 100%; display: flex;">
          <div class="col content" style="width: 100%; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 15px;">
            <h3 style="margin: 0; font-family: sans-serif; font-size: 1.1rem; color: #3f3d56; margin-bottom: 8px;">
            Dear `+email+`</h3>
            <p style="margin: 0; font-family: sans-serif; line-height: 1.5; color: #ff5d5d; font-size: 1.3rem;">
            Here is your reset password link
            </p>
          </div>
        </div>
        
  
        <div class="row" style="width: 100%; display: flex;">
          <div class="col content" style="width: 100%; padding-left: 30px; padding-right: 30px; padding-top: 15px; padding-bottom: 30px;">
  
            <p style="margin: 0; font-size: 15px; color: #3f3d56; font-family: sans-serif; line-height: 2;">
            To reset password <a style="color: #0369ee;" href="https://vibrer.cloud/reset-password?token=`+verification_token+`">Click
            Here</a><br>
            Thank you for using the Vibrer.
            </p>
          </div>
        </div>
        <div class="row" style="width: 100%; display: flex;">
          <div class="col footer text-center" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; padding: 30px 10px; background-color: #3f3d56; margin-top: 15px;">
            <p style="margin: 0; font-family: sans-serif; line-height: 1.5; color: #e9e8e8; font-size: 14px;">©
              2023 Vibrer</p>
          </div>
        </div>
      </div>
    </section>
  </body>
  
  </html>`;

  return data;
}

 getMessage = (body,to,from,subject) => {
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
  getMessage,
  getEmailVerification,
  getForgotPassword,
  generateRandomToken
};

