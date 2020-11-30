
const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'longrb1235@gmail.com',
        pass: 'oadtjahgyvuwgzuc'
    }
})

module.exports.sendMailforSignup = async (email) => {
    let info = await transporter.sendMail({
        from: 'longrb1235@gmail.com',
        to: email,
        subject: 'Signup success',
        html: `<h1>Success</h1>`
    })
}