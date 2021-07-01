require("dotenv").config();
const Prismic = require("@prismicio/client");

const client = Prismic.client(process.env.CMS_URL);

module.exports = async () => {
  const result = await client.query(
    Prismic.Predicates.at("document.type", "home")
  );

  return JSON.stringify(result.results[0].data.title[0].text);
};
