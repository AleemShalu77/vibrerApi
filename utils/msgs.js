//customer messages - 1001 to 1100

const message = {
  200: {
    message: "Data Show Successfully",
    httpCode: 200,
    status: 1,
  },
  201: {
    message: "Record Created Successfully",
    httpCode: 201,
    status: 1,
  },
  202: {
    message: "Record Updated Successfully",
    httpCode: 201,
    status: 1,
  },
  203: {
    message: "Record delete Successfully",
    httpCode: 201,
    status: 1,
  },
  204: {
    message: "No record found",
    httpCode: 200,
    status: 0,
  },
  205: {
    message: "Record already exists",
    httpCode: 200,
    status: 0,
  },
  400: {
    message: "Bad Request",
    httpCode: 400,
    status: 0,
  },
  401: {
    message: "You are not authorized to perform this action.",
    httpCode: 401,
    status: 0,
  },
  500: {
    message: "Error occured while processing request, please try again later",
    httpCode: 200,
    status: 0,
  },
  2015:{
    message: 'Reset password successfully',
    httpCode: 400,
    status: 0
  },
  2016:{
    message: 'Password and confirm password should not matched',
    httpCode: 400,
    status: 0
  },
  2017: {
    message: 'User not found',
    httpCode: 400,
    status: 0
  },
  2019: {
    message: 'Invalid email and/or password',
    httpCode: 400,
    status: 0
  },
  2021: {
    message: 'Login Successfull',
    httpCode: 200,
    status: 1
  },
  2022: {
    message: 'Invalid OR Expired Token',
    httpCode: 200,
    status: 0
  },
  2023: {
    message: 'Your account has been verified successfully',
    httpCode: 200,
    status: 1
  },
  2024:{
    message: 'Reset password link has been sent to your E-mail',
    httpCode: 200,
    status: 1
  },
  2025:{
    message: 'Something went wrong while sending E-mail',
    httpCode: 400,
    status: 0
  },
};

module.exports = message;
