// eslint-disable-next-line import/no-extraneous-dependencies
const cuid = require('cuid')
const qrcode = require('qrcode')
const { authenticator } = require('otplib')
const mail = require('../../../lib/sendEmail')
const resetPasswordEmailTemplate = require('../../../email/resetPasswordEmailTemplate')
const { addMinutes } = require('../../../lib/dateFnsFunctions')

const User = require('../../../models/users')

module.exports = {
  /**
   * @swagger
   * /forgotpassword:
   *   post:
   *     description: Request to get password reset link in mail
   *     operationId: forgotPassword
   *     tags: [Auth]
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               handle:
   *                 type: string
   *     responses:
   *       200:
   *         description: Request to get password reset link in mail
   *         contentType: application/json
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: boolean
   *               example: false
   *             handle:
   *               type: string
   *               example: "myEmail@logic-square.com"
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
   *               example: "Missing mandatory field `handle`"
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
   *               example: "Internal Server Error"
   */
  async startWorkflow (req, res) {
    try {
      const { handle } = req.body
      const user = await User.findOne({ email: handle }).exec()
      if (user === null) {
        throw new Error(
          'User not found, please check your email address and try again'
        )
      }
      if (!user.isActive) {
        throw new Error(
          'Oops, there is a problem with your account. Please contact admin'
        )
      }
      const now = Date.now()
      const token = cuid.slug()
      user.forgotpassword = {
        requestedAt: now,
        token,
        expiresAt: addMinutes(now, 65)
      }
      await user.save()
      const html = resetPasswordEmailTemplate(token, user.name.full)
      const emailResponse = await mail(user.email, 'Reset Password', html)
      if (emailResponse.error) throw new Error(emailResponse.data)

      return res.status(200).json({ error: false, handle })
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message })
    }
  },

  /**
   * @swagger
   * /resetpassword:
   *   post:
   *     description: Request to set a new password
   *     operationId: resetPassword
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *               password:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Request to set a new password
   *         contentType: application/json
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: boolean
   *               example: false
   *             email:
   *               type: string
   *               example: "myEmail@logic-square.com"
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
   *               example: "Missing mandatory field `token`"
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
   *               example: "Internal Server Error"
   */
  async resetPassword (req, res) {
    try {
      const { token, password, email } = req.body
      // if (/(?=.*([\d]|[\@\!\#\$\%\^\&\*\-\_\+\\\.\,\;\=])).{8,}/.test(password) === false) { // eslint-disable-line no-useless-escape
      //   throw new Error("Password should have length of at least 8 with one special character or number!")
      // }
      const user = await User.findOne({
        'forgotpassword.token': token,
        'forgotpassword.expiresAt': { $gte: new Date() },
        email
      }).exec()
      if (user === null) throw new Error('Invalid or Expired Token')
      // if (user === null) throw new Error("User not found, please check your email address and try again")
      if (!user.isActive) {
        throw new Error(
          'Oops, there is a problem with your account. Please contact admin'
        )
      }
      user.password = password
      user.lastModifiedAt = Date.now()
      user.forgotpassword = {
        requestedAt: null,
        token: null,
        expiresAt: null
      }
      await user.save()
      return res.status(200).json({ error: false, email })
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message })
    }
  },

  async qrCode (req, res) {

  }
}
