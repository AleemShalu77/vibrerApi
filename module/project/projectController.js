const projectService = require("./projectService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const { validateAddProjectReq } = require("./projectValidation");

const addProjectApplicant = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateAddProjectReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await projectService.addProjectApplicant(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    let result = await projectService.getProjects(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const viewProject = async (req, res, next) => {
  try {
    let result = await projectService.viewProject(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProjectApplicant,
  getProjects,
  viewProject,
};
