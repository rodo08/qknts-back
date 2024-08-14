import mongoose from "mongoose";
// import { MONGODB_URI } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://rodrigorosalesmoya:oELHkJLbN3hrHuxR@merndb.2efvohq.mongodb.net/mern"
    );
    console.log(">>DB Connected<<");
  } catch (error) {
    console.log(error);
  }
};
