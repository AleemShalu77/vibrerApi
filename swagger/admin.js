/**
 * @swagger
 * /add/admin:
 *   post:
 *     tags:
 *       - Admin
 *     name: Add Admin User
 *     summary: Add Admin User
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
 *         description: Admin added successfully
 */

/**
 * @swagger
 * /update/admin:
 *   put:
 *     tags:
 *       - Admin
 *     name: Update Admin User
 *     summary: Update Admin User
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
 *         description: Admin updated successfully
 */

  /**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - Admin
 *     name: Get Admin Details
 *     summary: Get Admin
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
 *         description: Admin Details Show Successfully
 */
 /**

/**
 * @swagger
 * /remove/user:
 *   post:
 *     tags:
 *       - Admin
 *     name: Remove Admin
 *     summary: Remove Admin
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
 *         description: Remove user
 */
 /**
  
 * @swagger
 * /all/user:
 *   get:
 *     tags:
 *       - Admin
 *     name: Get all Admin User List
 *     summary: Get all Admin User List
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: admin
 */