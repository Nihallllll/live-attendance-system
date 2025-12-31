import * as z from "zod";

enum Role {
  "teacher",
  "Student",
}
const PostAuthSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  role: Role,
});

const PostResponseSchemaStudent = z.object({
  success: z.boolean(),
  data: {
    _id: z.uint32(),
    name: z.string(),
    email: z.email(),
    role: "student",
  },
});

//---------------- login---------------

const PostLoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const PostLoginSuccessSchema = z.object({
  success: z.boolean(),
  data: {
    token: z.string(),
  },
});

//------- get student schema is same as postresponse schema------

//-------------Teacher Role------------

// to get the students in the class
const PostClassInfo = z.object({
  success: true,
  data: {
    _id: z.string(),
    className: z.string(),
    teacherId: z.string(),
    studentIds: z.array(z.string()),
  },
});

//add a student in a class
const AddStudentSchema = z.object({
  success: true,
  data: {
    _id: z.string(),
    className: z.string(),
    teacherId: z.string(),
    studentIds: z.array(z.string()),
  },
});

const GetClassDetailsSchema = z.object({
  success: true,
  data: {
    _id: z.string(),
    className: z.string(),
    teacherId: z.string(),
    students: z.array(
      z.object({
        _id: z.string(),
        name: z.string(),
        email: z.string(),
      })
    ),
  },
});

const GetAllStudents = z.object({
  success: true,
  data: z.array(
    z.object({
      _id: z.string(),
      name: z.string(),
      email: z.string(),
    })
  ),
});

//----------student-----------

//--------GET /class/:id/my-attendance--------

const PresentSchema = z.object({
  success: z.object(),
  data: z.object({
    classId: z.string(),
    status: z.string(),
  }),
});

const NotPresentSchema = z.object({
  success: z.object(),
  data: z.object({
    classId: z.string(),
    status: null,
  }),
});

//----------POST /attendance/start---------

const AttendanceSchema = z.object({
  success: z.boolean(),
  data: {
    classId: z.string(),
    startedAt: z.string(),
  },
});

export {
  Role,
  PostAuthSchema,
  PostResponseSchemaStudent,
  PostLoginSchema,
  PostLoginSuccessSchema,
  PostClassInfo,
  AddStudentSchema,
  GetClassDetailsSchema,
  GetAllStudents,
  PresentSchema,
  NotPresentSchema,
  AttendanceSchema,
};

