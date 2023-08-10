const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');

require('dotenv').config();

const userClient = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET
});
const getDadJoke = async () => {

  const dadJokeOptions = {
    method: 'GET',
    url: 'https://dad-jokes.p.rapidapi.com/random/joke',
    headers: {
      'X-RapidAPI-Key': '4a704ee0bbmsh5351e16703a5e8ep18dd77jsnbca616c253f5',
      'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(dadJokeOptions);
    const responseObj = response.data;

    return {
        setup: responseObj.body[0].setup,
        punchLine: responseObj.body[0].punchline
    };
  }
  catch(error) {
    console.log(error);
  }
}

const postTweet = async () => {
  const joke = await getDadJoke();
  const tweet = `${joke.setup }\n${joke.punchLine}`;
    
  try {
    await userClient.v2.tweet(tweet);
  }
  catch (error) {
      console.log(error);
  }
}

exports.handler = async (event) => {
  console.log('Lambda Function Triggered by Cloudwatch Event');
  await postTweet();
  console.log('Tweet Posted Successfully');
  return 'Function Tweeted Successfully';
  };
