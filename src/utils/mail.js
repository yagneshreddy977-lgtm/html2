import Mailgen  from "mailgen";

const emailVerificationMailContent = (username, verificationUrl) =>
    {
    return {
        body:{
            name:username,
            intro:"welcome to our App! we're excited to have you on board.",
            action:{
                instructions:"To verify you email please click on the following button",
                button:{
                    color:Green,
                    text:"verify Your email",
                    link:verificationUrl
                },
            },
            outro:"Need Help,or have questions? Jusdt reply to this emnail,we'd love to help."
        },
    };
};