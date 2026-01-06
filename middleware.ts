import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
export const authMiddleware =(req : Request, res :Response , next :NextFunction) =>{
    const token = req.headers.authorization;

    if(!token){
        return res.json({
            success : false
        })
    }

    try {
        const {user, role} = jwt.verify(token,"dafdf") as JwtPayload
        req.userId = user;
        req.role = role ;
        next()
    }catch(e){
        res.status(400).json({
            "success": false,
            "error" : "Unathorised acces"
        })
    }
}

export const teacherMiddleware = (req : Request, res :Response , next :NextFunction) =>{
    if(!req.role || req.role !== "teacher"){
        res.status(403).json({
            "success":false,
            "error":"Forbidden , teacher access required"
        })
        return
    }
    next()
}