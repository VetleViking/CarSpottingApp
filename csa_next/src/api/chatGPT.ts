import { OpenAI } from "openai";

export interface CarDetails {
    make: string;
    model: string;
    confidence?: number;
}

export default async function imageProcess(file: string, additionalInfo?: string) {
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
                        the format should be like this, and nothing else:
                        { "make": "Toyota", "model": "Corolla", "confidence": 85 }
                        the confidence is from 0 to 100. 
                        if you cant recognize all the details, leave the unknown parts with "cant recognize".
                        if either the make or model is unknown, set confidence to 0. Ensure that 'confidence' reflects the ypur certainty about the cars identification.
                        Its preferred if you make an educated guess. 
                        Dont make up cars that dont exist.
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
            model: "cant recognize",
            confidence: 0
        }
    }

    const json = JSON.parse(text.split("```json")[1].split("```")[0].trim());

    return json;
}