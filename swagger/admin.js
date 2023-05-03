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
 *   put:
 *     tags:
 *       - admin
 *     name: update admin
 *     summary: update admin
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             name:
 *               type: string
 *             status:
 *               type: number
 *         required:
 *           - id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: admin updated successfully
 */

  /**
 * @swagger
 * /user:
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
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *            type: integer
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