import mongoose from 'mongoose'

const connectDB = (url) => {
    return mongoose.connect(url, {
        dbName: "MelodyMatchDB"
    })
        .then(() => console.log('connected to mongodb'))
        .catch((err) => console.log('mongodb connection error: ' + err))
}

export default connectDB