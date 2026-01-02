import mongoose from "mongoose";
import { _string } from "zod/v4/core";

const UserSchema = new mongoose.Schema({
    name : String,
    email : {type : String , unique : true},
    password : String,
    role : String
})

const ClassSchema = new mongoose.Schema({
    className  :String ,
    teacherId :{
        type :mongoose.Types.ObjectId,
        ref:"Users"
    },
    studentId : [{
        type :mongoose.Types.ObjectId,
        ref : "Users"
    }]
})

const AttendanceSchema = new mongoose.Schema({
    classId : mongoose.Types.ObjectId,
    studentId : mongoose.Types.ObjectId,
    status : String
})

export const userModel = mongoose.model("Users", UserSchema);
export const classModel = mongoose.model("Class", ClassSchema);
export const attendanceModel = mongoose.model("Users", AttendanceSchema);