const axios = require("axios");
const dotenv = require("dotenv").config();
const paginateResults = (page, pageSize, data) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const results = {};

  if (endIndex < data.length) {
    results.next = {
      page: page + 1,
      pageSize: pageSize,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      pageSize: pageSize,
    };
  }

  results.results = data.slice(startIndex, endIndex);
  return results;
};

module.exports.sendPosts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${apiKey}`;
    const { data } = await axios.get(apiUrl);
    const paginatedResults = paginateResults(page, pageSize, data.articles);
    return res.status(200).send({
      success: true,
      message: "Posts recived",
      posts: paginatedResults,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
