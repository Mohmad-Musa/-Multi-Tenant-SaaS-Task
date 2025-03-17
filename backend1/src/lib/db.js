import mongoose from "mongoose"



export const DBConnection = async () =>
    {
try{
const conn = await mongoose.connect(process.env.MONGODB_URI);
console.log(`Connected to Db ${conn.connection.host}`)
}
catch (error){
console.log(error,"Error with connection to DB")
}

}