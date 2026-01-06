import express, { type Request, type Response } from "express";
import * as z from "zod";
import jwt from "jsonwebtoken";
import {
  AddStudentSchema,
  clasSchema,
  PostAuthSchema,
  PostLoginSchema,
  PostResponseSchemaStudent,
} from "./utils/routes_schema";
import { authMiddleware, teacherMiddleware } from "./middleware";
import { attendanceModel, classModel, userModel } from "./models";
const app = express();

app.use(express.json());

app.post("/auth/signup", async (req: Request, res: Response) => {
  const { success, data } = PostAuthSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }
  //hash the password
  const user = await userModel.findOne({
    email: data?.email,
  });
  if (user) {
    res.status(400).json({
      success: false,
      error: "Email already exists",
    });
  }

  const createUser = await userModel.create({
    name: data?.name,
    email: data?.email,
    password: data?.password,
  });

  res.status(200).json({
    success: true,
    data: {
      _id: createUser.id,
      name: data?.name,
      email: data?.email,
      role: data?.role,
    },
  });
});

app.post("/auth/login", async (req, res) => {
  const { success, data } = PostLoginSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }

  //   const response = jwt.sign
  const userDb = await userModel.findOne({
    email: data?.email,
  });

  if (!userDb || userDb.password != data?.password) {
    res.status(400).json({});
  }

  const token = jwt.sign(
    {
      role: userDb?.role,
      userId: userDb?._id,
    },
    "JWT_SECRET"
  );
  res.status(200).json({
    success: true,
    data: {
      token: token,
    },
  });
});

app.get("/auth/me", authMiddleware, async (req, res) => {
  const userDb = await userModel.findOne({
    _id: req.userId,
  });

  if (!userDb) {
    res.status(400).json({
      message: "Damn",
    });
  }
  res.json({
    success: true,
    data: {
      _id: userDb?.id,
      name: userDb?.name,
      email: userDb?.email,
      role: userDb?.role,
    },
  });
});

app.post(
  "/class",
  authMiddleware,
  teacherMiddleware,
  async (req: Request, res: Response) => {
    const { success, data } = clasSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        success: false,
        error: "Unauthorized, token missing or invalid",
      });
    }

    const classDb = await classModel.create({
      className: data?.className,
      teacherId: req.userId,
      studentId: [],
    });
    res.status(200).json({
      success: true,
      data: {
        _id: classDb._id,
        className: classDb.className,
        teacherId: classDb.teacherId,
        studentIds: [],
      },
    });
  }
);

app.post(
  "/class/:id/add-student",
  authMiddleware,
  teacherMiddleware,
  async (req: Request, res: Response) => {
    const { success, data } = AddStudentSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        error: "Invalid request schema",
      });
    }
    const classDb = await classModel.findByIdAndUpdate(
      req.params.id,
      { $push: { studentId: data?.studentId } },
      { new: true }
    );
    if (classDb?.teacherId !== req.userId) {
      res.status(403).json({
        success: false,
        error: "Forbidden, not class teacher",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        _id: classDb?._id,
        className: classDb?.className,
        teacherId: classDb?.teacherId,
        studentIds: classDb?.studentId,
      },
    });
  }
);

app.get(
  "/class/:id",
  authMiddleware,
  teacherMiddleware,
  async (req: Request, res: Response) => {
    const classId = req.params.id;
    const classDb = await classModel.findById(classId);
    if (!classDb) {
      res.status(400).json({
        success: false,
        error: "Class doesnt exists",
      });
    }
    const students = await userModel.find({ id: classDb?.studentId });
    res.status(200).json({
      success: true,
      data: {
        _id: classDb?.id,
        className: classDb?.className,
        teacherId: classDb?.teacherId,
        students: students.map((s) => ({
          _id: s.id,
          name: s.name,
          email: s.email,
        })),
      },
    });
  }
);

app.get("/students", authMiddleware, teacherMiddleware, async (req, res) => {
  const users = await userModel.find({
    role: "student",
  });
  res.json({
    success: true,
    data: users.map((u) => ({
      _id: u.id,
      name: u.name,
      email: u.email,
    })),
  });
});

app.get("/class/:id/my-attendance", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  const classDb = await classModel.find({
    id: id,
  });
  if (!classDb) {
    res.status(404).json({
      success: false,
      error: "Class not found",
    });
  }

  const attendence  = await attendanceModel
});

app.post("/attendance/start" , authMiddleware , teacherMiddleware , (req,res)=>{
  const {success , data} = clasSchema.safeParse(req.userId);
  if(!success){
    
  }
})

app.listen(3000);
