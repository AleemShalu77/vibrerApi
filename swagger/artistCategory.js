/**
 * @swagger
 * /add/artist-category:
 *   post:
 *     tags:
 *       - Artist Category
 *     name: Add Artist Category
 *     summary: Add Artist Category
 *     consumes:
 *       - application/json
 *     parameters:
 *             - name : name
 *               in: formData
 *               type: string
 *               required: true
 *             - name : status
 *               in: formData
 *               type: string
 *               required: true
 *             - name : icon_img
 *               in: formData
 *               type: string
 *               required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Artist Category added successfully
 */

/**
 * @swagger
 * /update/artist-category:
 *   put:
 *     tags:
 *       - Artist Category
 *     name: Update Artist Category
 *     summary: Update Artist Category
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
 *         description: Artist Category updated successfully
 */

  /**
 * @swagger
 * /artist-category:
 *   get:
 *     tags:
 *       - Artist Category
 *     name: Get Artist Category Details
 *     summary: Get Artist Category
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
 *         description: Artist Category Details Show Successfully
 */
 /**

/**
 * @swagger
 * /remove/artist-category:
 *   post:
 *     tags:
 *       - Artist Category
 *     name: Remove Artist Category
 *     summary: Remove Artist Category
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
 *         description: Remove Artist Category
 */
 /**
  
 * @swagger
 * /all/artist-category:
 *   get:
 *     tags:
 *       - Artist Category
 *     name: Get all Artist Category List
 *     summary: Get all Artist Category List
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Artist Category List
 */