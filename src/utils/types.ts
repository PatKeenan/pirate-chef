import { z } from "zod";

export const formSchema = z.object({
    meal: z.string(),
    'nutritional-goal': z.string(),
    "favorite-foods": z.string(),
})
export type FormSchema= z.infer<typeof formSchema>