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
    message: "Record deleted Successfully",
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
  206: {
    message: "Record does not exists",
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
  2015: {
    message: "Reset password successfully",
    httpCode: 200,
    status: 1,
  },
  2016: {
    message: "Password and confirm password did not match",
    httpCode: 400,
    status: 0,
  },
  2017: {
    message: "User not found",
    httpCode: 400,
    status: 0,
  },
  2018: {
    message: "Token is expired",
    httpCode: 400,
    status: 0,
  },
  2019: {
    message: "Invalid email and/or password",
    httpCode: 400,
    status: 0,
  },
  2021: {
    message: "Login Successfull",
    httpCode: 200,
    status: 1,
  },
  2022: {
    message: "Invalid OR Expired Token",
    httpCode: 200,
    status: 0,
  },
  2023: {
    message: "Your account has been verified successfully",
    httpCode: 200,
    status: 1,
  },
  2024: {
    message: "Reset password link has been sent to your E-mail",
    httpCode: 200,
    status: 1,
  },
  2025: {
    message: "Something went wrong while sending E-mail",
    httpCode: 400,
    status: 0,
  },
  2026: {
    message: "Project not found",
    httpCode: 400,
    status: 0,
  },
  2027: {
    message: "Applicant successfully added",
    httpCode: 200,
    status: 0,
  },
  2028: {
    message: "Something went wrong please try again later",
    httpCode: 400,
    status: 0,
  },
  2029: {
    message: "File is required",
    httpCode: 400,
    status: 0,
  },
  2030: {
    message: "File uploaded successfully",
    httpCode: 200,
    status: 1,
  },
  2031: {
    message: "Contest not found",
    httpCode: 400,
    status: 0,
  },
  2032: {
    message: "Participant not found",
    httpCode: 400,
    status: 0,
  },
  2033: {
    message: "Added to favourite successfully",
    httpCode: 201,
    status: 1,
  },
  2034: {
    message: "Participant removed from favourites successfully",
    httpCode: 200,
    status: 1,
  },
  2035: {
    message: "You have voted successfully",
    httpCode: 201,
    status: 1,
  },
  2036: {
    message: "Vote is removed successfully",
    httpCode: 200,
    status: 1,
  },
};

module.exports = message;
