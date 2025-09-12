import mongoose from 'mongoose';

const mongo_url = "mongodb://localhost:27017/Doctors";

main()
.then(() =>{
    console.log("connection succesfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

export default main;