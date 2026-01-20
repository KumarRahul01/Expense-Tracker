import ratelimit from "../config/upstash.js";


const rateLimiter = async (req, res, next) => {
  try {
    // here we just kept it simple
    // but in real-world-app you had to put the userId or Ip Address as your key
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({ message: "Too many requests, Please try again later." })
    }

    next();

  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
}


export default rateLimiter;
