import { z } from "zod";

const ExampleSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive()
}).strict();

export { ExampleSchema };