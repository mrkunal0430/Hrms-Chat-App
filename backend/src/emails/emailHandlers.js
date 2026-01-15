 import { resendClient, sender } from "../lib/resend.js";
 import { createWelcomeEmailTemplate } from "../emails/emailTemplate.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
    const {data, error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to HRMS Chat",
        html: createWelcomeEmailTemplate(name, clientURL),
    });

    if(error){
        console.log("Error in sendWelcomeEmail : ",error);
        throw new Error("Failed to send welcome email");
    }

    console.log("Email sent successfully",data);
}
