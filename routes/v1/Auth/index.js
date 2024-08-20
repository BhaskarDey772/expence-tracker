// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken')

const User = require('../../../models/users')

module.exports = {
  /**
   * @swagger
   * /login:
   *   post:
   *     description: User Login
   *     operationId: userLogin
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               handle:
   *                 type: string
   *               password:
   *                 type: string
   *
   *     responses:
   *       200:
   *         description: User Login
   *         contentType: application/json
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: boolean
   *               example: false
   *             handle:
   *               type: string
   *               example: myEmail@logic-square.com
   *             token:
   *               type: string
   *               example: authToken.abc.xyz
   *       400:
   *         description: Bad Request
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: boolean
   *               example: true
   *             reason:
   *               type: string
   *               example: Fields `handle` and `password` are mandatory
   *       500:
   *         description: Internal Server Error
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: boolean
   *               example: true
   *             reason:
   *               type: string
   *               example: User Not Found
   *
   */
  async post (req, res) {
    try {
      // const { type } = req.params
      const {
        handle,
        password
      } = req.body
      if (handle === undefined || password === undefined) {
        return res.status(400).json({
          error: true,
          reason: 'Fields `handle` and `password` are mandatory'
        })
      }
      const user = await User.findOne({
        $or: [{
          email: handle.toLowerCase()
        }, {
          phone: handle
        }]
      }).exec()
      if (user === null) throw new Error('User Not Found')
      if (user.isActive === false) throw new Error('User Inactive')
      // check pass
      await user.comparePassword(password)
      // No error, send jwt
      const payload = {
        id: user._id,
        _id: user._id,
        fullName: user.name.full,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive
      }
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600 * 24 * 30 // 1 month
      })
      return res.json({
        error: false,
        handle,
        token
      })
    } catch (err) {
      return res.status(500).json({
        error: true,
        reason: err.message
      })
    }
  }
}
