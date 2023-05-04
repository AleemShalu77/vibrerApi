/**
 * @swagger
 * /add/admin:
 *   post:
 *     tags:
 *       - admin
 *     name: Add admin
 *     summary: Add admin
 *     consumes:
 *       - application/json
 *     parameters:
 *             - name : first_name
 *               in: formData
 *               type: string
 *               required: true
 *             - name : last_name
 *               in: formData
 *               type: string
 *               required: true
 *             - name : role
 *               in: formData
 *               type: string
 *               required: true
 *             - name : email
 *               in: formData
 *               type: string
 *               required: true
 *             - name : password
 *               in: formData
 *               type: string
 *               required: true
 *             - name : verification
 *               in: formData
 *               type: string
 *               required: true
 *             - name : profile_img
 *               in: formData
 *               type: file
 *               required: true
 *             - name : createdBy
 *               in: formData
 *               type: string
 *               required: true
 *             - name : updatedBy
 *               in: formData
 *               type: string
 *               required: true
 *             - name : status
 *               in: formData
 *               type: string
 *               required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: admin added successfully
 */

/**
 * @swagger
 * /update/admin:
 *   post:
 *     tags:
 *       - admin
 *     name: Update admin
 *     summary: Update admin
 *     consumes:
 *       - application/json
 *     parameters:
 *             - name : id
 *               in: formData
 *               type: string
 *               required: true
 *             - name : first_name
 *               in: formData
 *               type: string
 *               required: true
 *             - name : last_name
 *               in: formData
 *               type: string
 *               required: true
 *             - name : role
 *               in: formData
 *               type: string
 *               required: true
 *             - name : email
 *               in: formData
 *               type: string
 *               required: true
 *             - name : verification
 *               in: formData
 *               type: string
 *               required: true
 *             - name : profile_img
 *               in: formData
 *               type: file
 *             - name : updatedBy
 *               in: formData
 *               type: string
 *               required: true
 *             - name : status
 *               in: formData
 *               type: string
 *               required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: admin updated successfully
 */

  /**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - admin
 *     name: Get admin
 *     summary: Get admin
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *            type: integer
 *         required: true
 *         description: User id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: admin
 */
/**
 * @swagger
 * /remove/user/{id}:
 *   post:
 *     tags:
 *       - admin
 *     name: Remove admin
 *     summary: Remove admin
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *            type: integer
 *         required: true
 *         description: User id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: admin
 */
 /**
 * @swagger
 * /all/user:
 *   get:
 *     tags:
 *       - admin
 *     name: Get all users
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: admin
 */