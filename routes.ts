import express, { type Request, type Response } from "express"
import * as z from "zod";
import {PostAuthSchema } from "./utils/routes_schema";
const app = express()

app.use(express.json());

app.post("/auth/signup", (req: Request,res: Response)=>{
    const { name, email, password, role } = PostAuthSchema.parse(req.body);
    
})