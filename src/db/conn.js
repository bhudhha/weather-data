const mongoose = require('mongoose')
// const MONGODB_URL='mongodb+srv://Rahul_user:rahulkumar@rahul.qsswr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected suceessfully");
})
    .catch((e) => {
        console.log(`your connection erro ${e}`);
    })