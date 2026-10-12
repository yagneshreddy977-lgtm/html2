import Mailgen  from "mailgen";
import nodemailer from "nodemailer";
//for sending the mail we require this much stuff
const sendEmail = async(options)=>{
    const mailGenerator = new Mailgen({
        theme:"default",
        product:{
            name:"Task manager",
            link :"https://taskmanagerlink.com"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)

    const emailHtml = mailGenerator.generate(options.mailgenContent)


    const transporter = nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = {
        from:"mail.taskmanager@example.com",
        to:options.email,
        subject:options.subject,
        text:emailTextual,
        html:emailHtml
    }

    try{
        await transporter.sendMail(mail)
    }catch(error){
        console.error("email services failed ......")
        console.error("Error:",error)
        throw error
    }
};




const emailVerificationMailContent = (username, verificationUrl) =>
    {
    return {
        body:{
            name:username,
            intro:"welcome to our App! we're excited to have you on board.",
            action:{
                instructions:"To verify you email please click on the following button",
                button:{
                    color:"#22c55e",
                    text:"verify Your email",
                    link:verificationUrl
                },
            },
            outro:"Need Help,or have questions? Jusdt reply to this emnail,we'd love to help."
        },
    };
};

export {
    emailVerificationMailContent,
    sendEmail,
}; 