import nodemailer from "nodemailer";

const sendResetPasswordMail = async (to, url) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_SENDER_EMAIL,
            pass: process.env.MAIL_SENDER_PASS 
        }
    });

    const mailOptions = {
        from: process.env.MAIL_SENDER_EMAIL,
        to: to,
        subject: "[MelodyMatch] Password Reset",
        html: `
        <div style="width: 100%; background-color: rgb(250, 250, 250); text-align: center">
            <br>
            <a href="http://localhost:5173/" style="text-align: center; font-size: 26px; color: #199890; text-decoration: none;font-weight: bold">MelodyMatch</a>
            <br>
            <br>
            <div style="font-size: 16px; margin: 0 auto; width: 50%; color: black; background-color: white; padding: 40px; ">
                <div style="margin-bottom: 20px;">Someone requested to reset the password for the following account:</div>
                <div style="margin-bottom: 20px;">If this was a mistake, just ignore this email and nothing will happen.</div>
                <div style="margin-bottom: 30px;">To reset your password, click the button below.</div>
        
                <a href=${url} style="text-align: center; font-size: 15px; text-align: center; background-color: #199890; padding: 10px 24px; text-decoration: none; border-radius: 3px; color:white">Reset Password</a>
            </div>
            <br>
            <br>
            <p>© ${new Date().getFullYear()} MelodyMatch LLC</p>
            <p>All rights reserved.</p>
            <br>
            <br>
        </div>
        `
    }

    await transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log('success')
        }
    });
}

const sendContactMail = async (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_SENDER_EMAIL,
            pass: process.env.MAIL_SENDER_PASS 
        }
    });

    const mailOptions = {
        from: process.env.MAIL_SENDER_EMAIL,
        to: process.env.MAIL_SENDER_EMAIL,
        replyTo: to, // Allows you to directly reply to the user who sent the message
        subject: "[MelodyMatch] Contact Form",
        html: `
        <div style="width: 100%; background-color: rgb(250, 250, 250); text-align: center">
            <br>
            <a href="http://localhost:5173/" style="text-align: center; font-size: 26px; color: #199890; text-decoration: none;font-weight: bold">MelodyMatch</a>
            <br>
            <br>
            <div style="font-size: 16px; margin: 0 auto; width: 50%; color: black; background-color: white; padding: 40px; ">
                <div style="margin-bottom: 16px; font-size: 20px;">New Contact Form Submission:</div> 
                <p>Email: <a href="mailto:${to}" style="color: #199890; text-decoration: none;">${to}</a></p>
                <p>Subject: ${subject}</p>
                <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border: 1px solid #eee; border-radius: 4px;">
                    <p style="margin-top: 0;">Message:</p>
                    <p style="margin-bottom: 0;">${message}</p>
                </div>       
            </div>
            <br>
            <br>
            <p>© ${new Date().getFullYear()} MelodyMatch LLC</p>
            <p>All rights reserved.</p>
            <br>
            <br>
        </div>
        `
    }

    await transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log('success')
        }
    });
}

export {sendResetPasswordMail, sendContactMail}