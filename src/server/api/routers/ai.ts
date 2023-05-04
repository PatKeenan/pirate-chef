import { formSchema } from "~/utils/types";
import { createTRPCRouter, publicProcedure } from "../trpc";


export const aiRouter = createTRPCRouter({
    getResponse: publicProcedure
      .input(formSchema)
      .query(({ input }) => {
       return {message: 'hello world'}
      }),
    })