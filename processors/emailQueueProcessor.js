const sendUserCreationEmail = require("../mail/sendAccountCreationEmail");

const emailQueueProcessor = async (job, done) => {
//console.log("Job",job.data.user);
  try {
    const { name, email } = job.data.user;

    // Sending email
    await sendUserCreationEmail({
      name,
      email,
    });    
    setTimeout(() => {
      done();
    }, 4000); 
  } catch (error) {
    console.log(error);
    done(error); 
  }
};

module.exports = emailQueueProcessor;
