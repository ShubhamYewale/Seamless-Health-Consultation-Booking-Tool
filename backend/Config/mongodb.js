import mongoose from 'mongoose';

const mongo_url = "shubhamyewale1213_db_user:hRZt3glcUx8h7oOH@cluster0.mmmpl63.mongodb.net/Doctors";

main()
.then(() =>{
    console.log("connection succesfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

export default main;
