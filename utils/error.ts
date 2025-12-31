import * as z from "zod";

const Error = z.object({
    success : z.boolean(),
    error : z.string()
})
