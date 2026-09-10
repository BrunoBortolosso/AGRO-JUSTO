import { z } from "zod";

const civilDateString = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve usar o formato YYYY-MM-DD.")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(`${value}T00:00:00.000Z`);
    return date.getUTCFullYear() === year
      && date.getUTCMonth() + 1 === month
      && date.getUTCDate() === day;
  }, "Data inválida.")
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

const civilDate = z.union([z.date(), civilDateString]);

const CreateRentalSchema = z.object({
  machineId: z.string().trim().min(1),
  tenant: z.string().trim().min(1),
  start: civilDate,
  end: civilDate,
  notes: z.string().trim().optional()
}).strict().superRefine((value, context) => {
  if (value.end < value.start) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["end"],
      message: "A data final deve ser igual ou posterior à data inicial."
    });
  }
});

export { CreateRentalSchema };