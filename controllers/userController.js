const User = require("../models/User");
const Queue = require('bull');
const sendEmailCreationEmail = require("../mail/sendAccountCreationEmail");
const { REDIS_PORT, REDIS_URI } = require("../config/redisCredential");

require("../processors/index");
const emailQueue = new Queue("emailQueue", {
  redis: {
    port: REDIS_PORT,
    host: REDIS_URI,
  },
});

// Function to create user and send email
exports.create = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.create({
      name,
      email,
    });

    await sendEmailCreationEmail({ name, email });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating user", error });
  }
};

// Function to send emails to users
exports.sendEmailToUser = async (req, res) => {
  try {
    const users = await User.find();
   
    users.forEach((user, index) => {
      emailQueue.add(
        { user },
        {
          // Set delay for processing jobs
          delay: 4000, 
        }
      )
      .then((job) => {
        console.log("users from mongo =>",index, "==> ",user)
        if (index + 1 === users.length) {
          res.json({
            message: "All users are added to the queue.",
          });
        }
      })
      .catch(error => {
        console.error("Queue error", error);
        res.status(500).json({ message: "Queue processing error", error });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending emails", error });
  }
};
