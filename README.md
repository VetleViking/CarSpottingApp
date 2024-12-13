# Car Spotting App
A website where you can upload images of your spots of cars. The site is currently under development.


The site is built with NextJS using TypeScript and Tailwind in the frontend, Redis for the database, and Express for the backend. The site is utilizing ChatGPT 4.0 lite using the [OpenAI api](https://platform.openai.com/api-keys) for AI-recognization of the make and models of cars, as well as [Statens Vegvesen reg api](https://www.vegvesen.no/om-oss/om-organisasjonen/apne-data/et-utvalg-apne-data/api-for-tekniske-kjoretoyopplysninger/) to have the ability to search up car details for norwegian reg-numbers.

The link to the site is: https://spots.vest.li

## Running the site
If you want to run your own version of the site, you can do so in a couple of steps.

First, you will need Docker, and Redis Insight if you want to see the data in the database easier.
Then, set up the .env files in the frontend and backend according to the .env.example files.
And then, install packages and run the Frontend with
```bash
npm i
npm run dev
```
and the backend with
```bash
npm i
docker-compose up -d
npm run dev
```
you will probably need to change the /addspot endpoint, as it depends on the CDN i have set up, and saves the images to a file and only saves links to them (for example https://images.vest.li/Vetle/Porsche_944/0_0.jpg). Either set it up for your cdn, or replace the links with placeholder links so that it still works (for example https://cataas.com/cat)
