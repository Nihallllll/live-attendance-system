import express, { type Request, type Response } from "express";
import * as z from "zod";
import jwt from "jsonwebtoken";
import {
  PostAuthSchema,
  PostLoginSchema,
  PostResponseSchemaStudent,
} from "./utils/routes_schema";
import { authMiddleware } from "./middleware";
import { userModel } from "./models";
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

app.get("/auth/me", authMiddleware, async(req, res) => {
  const userDb =await userModel.findOne({
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
      "_id": userDb?.id,
      name: userDb?.name,
      email: userDb?.email,
      role: userDb?.role,
    },
  });
});


app.listen(3000);
