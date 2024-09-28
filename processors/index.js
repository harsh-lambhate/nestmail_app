const Queue = require("bull");
const path = require("path");
const { REDIS_PORT, REDIS_URI } = require("../config/redisCredential");
const emailQueue = new Queue("emailQueue", {
     redis: {
          port: REDIS_PORT,
          host: REDIS_URI,
     },
});

console.log("start running processor");
emailQueue.process(path.join(__dirname, "emailQueueProcessor.js"));
console.log("end running processor");


console.log("start running completed");
emailQueue.on('completed',(job)=>{
     console.log(`Completed ${job.id} Job `);
})
console.log("end running completed");