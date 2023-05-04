import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
import type { FormSchema } from "~/utils/types";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const OPEN_AI_API_KEY = env.OPEN_AI_API_KEY
    const config = new Configuration({
        apiKey: OPEN_AI_API_KEY,
    })
    
    const opeanai = new OpenAIApi(config)
    const data = req.body as unknown;
    const formEntries: FormSchema | undefined = typeof data == 'string' ?  JSON.parse(data) as FormSchema : undefined
   
    if(typeCheck<FormSchema>(formEntries)) {
    
     const completion = await opeanai.createCompletion({
        model: 'text-davinci-003',
        prompt: `You are a chef on a pirate ship and a crew member asks you to cook a meal for them. The crew member tells you that they have a nutritional goal which is to ${formEntries['nutritional-goal']}. They also tell you their favorite foods are ${formEntries['favorite-foods']}. The meal you cook for them has to be for ${formEntries['meal']} and it must contain their favorite foods. If their favorite foods are not found at sea, recommend something else that would be available. Knowing their nutritional goal and their favorite foods, what meal do you cook for them? Please explain why you chose the meal to the crew member with in a very snarky tone as if you were a pirate on the open seas in the 1400's.`,
        temperature: 0,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1024,
    }).catch(err => console.error(err))

  
    return res.status(200).json({ text: completion?.data?.choices[0]?.text || '' })
}

    return res.status(200).json({ text: '' })
}

function typeCheck<T>(data: unknown): data is T {
    if(typeof data !== 'object' || data === null || !Object.keys(data).every(key => key in data)) {
        return false
    }
    return true
}