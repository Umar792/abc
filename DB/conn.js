const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDb Is Connected")
}).catch((err) => {
    console.log(`MongoDb Error: ${err}`)
})