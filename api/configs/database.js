import mongoose from 'mongoose'

// This Will Ensure That Only The Specified Fields Inside Our Schema Will Be Saved To The Database
mongoose.set('strictQuery', true)
mongoose.set('strictPopulate', false)

const ConnectMongoDB = async (uri) => {
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  await mongoose.connect(uri, connectionOptions)
    .then(() => console.log(`Successfully Connected To MongoDB, @URI = ${uri}`))
    .catch(error => console.error(`Database Connection Error: ${error}`))
};

mongoose.connection.on("disconnected", () => console.log(`MongoDB Connection Disconnected!`))

export default ConnectMongoDB