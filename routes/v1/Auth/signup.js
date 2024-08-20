const User = require('../../../models/users')

module.exports = {
  /**
    *
    * @api {post} /signup User registration
    * @apiName userRegistration
    * @apiGroup Auth
    * @apiVersion  1.0.0
    * @apiPermission Public
    *
    *
    * @apiParam  {String} email
    * @apiParam  {String} phone
    * @apiParam  {Object} name
    * @apiParam  {String} password
    *
    * @apiSuccess (200) {json} name description
    *
    * @apiParamExample  {json} Request-Example:
      {
        "email": "myEmail@logic-square.com",
        "phone": "00000000000",
        "name": {
          "first":"Jhon",
          "last" :"Doe"
        }
      }
    *
    * @apiSuccessExample {json} Success-Response:
      {
        "error": false,
        "user": {
          "email": "myEmail@logic-square.com",
          "phone": "00000000000",
          "name": {
            "first":"Jhon",
            "last" :"Doe"
          }
        }
      }
    *
    *
    */
  /**
 * @swagger
 * /signup:
 *   post:
 *     description: User registration
 *     operationId: userRegistration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *               name:
 *                 type: object
 *                 properties:
 *                   first:
 *                     type: string
 *                   last:
 *                     type: string
 *               password:
 *                 type: string
 *               isSuperAdmin:
 *                 type: boolean
 *               permissionGroup:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     name:
 *                       type: object
 *                       properties:
 *                         first:
 *                           type: string
 *                         last:
 *                           type: string
 *       400:
 *         description: Missing mandatory field `email`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 reason:
 *                   type: string
 *                   example: "Missing mandatory field `email`"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 reason:
 *                   type: string
 *                   example: "Internal Server Error"
 */

  async post (req, res) {
    try {
      const {
        email, phone, name, password
      } = req.body
      if (email === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: 'Missing manadatory field `email`' })
      }
      if (name === undefined || name.first === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: 'Please specify First Name!' })
      }
      let user = await User.create({
        email,
        phone,
        password,
        name
      })
      user = user.toObject()
      delete user.password
      delete user.forgotpassword

      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
