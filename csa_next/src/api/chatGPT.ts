import { OpenAI } from "openai";

export default async function imageProcess(file: string, additionalInfo: string) {
    const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are good at recognizing cars from images, and send me JSON." },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `recognize the car in the image. send me JSON of the car details. 
                        the format should be like this:
                        { "make": "Toyota", "model": "Corolla"}
                        if you cant recognize all the details, leave the unknown parts with "cant recognize".
                        ${additionalInfo ? "here is some additional info to help you recognize the car: " + additionalInfo : ""}`
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: file
                        }
                    }
                ]
            },
        ],
    });

    const text = completion.choices[0].message.content || "";
    if (!text.includes("```json")) {
        return {
            make: "cant recognize",
            model: "cant recognize"
        }
    }

    const json = JSON.parse(text.split("```json")[1].split("```")[0].trim());

    return json;
}