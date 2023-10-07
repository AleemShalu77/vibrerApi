const projectController = require("./projectController");

module.exports = (router) => {
  router.post(
    "/addApplicant/:projectId",
    projectController.addProjectApplicant
  );
  router.get("/getProjects", projectController.getProjects);
  router.get("/project-view/:id", projectController.viewProject);
};
