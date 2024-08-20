const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)
// (async function () {
//   try {
//     const data = await resend.emails.send({
//       from: 'Bhaskar Dey <contact@bhaskardey.com>',
//       to: ['sahupratik30@gmail.com'],
//       subject: 'Hello World',
//       html: generateResetPasswordEmail('pratik@12344', 'Pratik')
//     })

//     console.log(data)
//   } catch (error) {
//     console.error(error)
//   }
// })()

module.exports = async (email, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: 'Expence Tracker <contact@bhaskardey.com>',
      to: [email],
      subject,
      html
    })

    return { error: false, data }
  } catch (error) {
    return { error: true, data: error }
  }
}
