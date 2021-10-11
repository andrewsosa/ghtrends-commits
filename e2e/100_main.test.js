const axios = require("axios");

const url = process.env.TEST_URL;
const repo = "andrewsosa/githubtrends-commits";

describe("main", () => {
  test("it responds with a downloadable url", async () => {
    const resp = await axios.get(`${url}?repo=${repo}`);
    expect(resp.status).toEqual(200);
    expect(resp.data).toHaveProperty("downloadUrl");
  });
});
