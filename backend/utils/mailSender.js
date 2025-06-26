import nodemailer from "nodemailer";

const mailSender = async (from, to, url) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: from,
            pass: process.env.MAIL_SENDER_PASS 
        }
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: "[Pronia] Password Reset",
        html: `
        <div style="width: 100%; background-color: rgb(250, 250, 250); text-align: center">
            <br>
            <a href="http://localhost:5173/" style="text-align: center; font-size: 26px; color: #a4ce6a; text-decoration: none;font-weight: bold">Pronia</a>
            <br>
            <br>
            <div style="font-size: 16px; margin: 0 auto; width: 50%; color: black; background-color: white; padding: 40px; ">
                <div style="margin-bottom: 20px;">Someone requested to reset the password for the following account:</div>
                <div style="margin-bottom: 20px;">If this was a mistake, just ignore this email and nothing will happen.</div>
                <div style="margin-bottom: 30px;">To reset your password, click the button below.</div>
        
                <a href=${url} style="text-align: center; font-size: 15px; text-align: center; background-color: #a4ce6a; padding: 10px 24px; text-decoration: none; border-radius: 3px; color:white";>Reset Password</a>
            </div>
            <br>
            <br>
            <p>© ${new Date().getFullYear()} Pronia LLC</p>
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

export default mailSender