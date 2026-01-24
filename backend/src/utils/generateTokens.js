const jwt = require("jsonwebtoken");

/**
 * Generates an access token for the given user.
 * The token is a JSON Web Token (JWT) that contains the user's ID and role.
 * The token is signed with a secret key and has an expiration time of 15 minutes.
 * @param {Object} user - the user object
 * @returns {string} - the access token
 */
const generateAccessToken = (user) => {
  const { _id, role } = user;
  const secretKey = process.env.JWT_SECRET;

  // Sign the token with the secret key and expiration time
  return jwt.sign({ userData: { _id, role } }, secretKey, { expiresIn: "30m" });
};
/**
 * Generates a refresh token for the given user.
 * The token is a JSON Web Token (JWT) that contains the user's ID and role.
 * The token is signed with a secret key and has an expiration time of 7 days.
 * The refresh token is used to obtain a new access token when the current one expires.
 * @param {Object} user - the user object
 * @returns {string} - the refresh token
 */
const generateRefreshToken = (user) => {
  const { _id, role } = user;
  const secretKey = process.env.REFRESH_TOKEN_SECRET;

  // Sign the token with the secret key and expiration time
  // The refresh token is valid for 7 days, and can be used to obtain a new access token
  // by sending a request to the /refresh endpoint with the refresh token in the Authorization header.
  return jwt.sign({ userData: { _id, role } }, secretKey, {
    expiresIn: "7d", // expires in 7 days
    /**
     * The refresh token is used to obtain a new access token when the current one expires.
     * The refresh token is valid for 7 days, and can be used to obtain a new access token
     * by sending a request to the /refresh endpoint with the refresh token in the Authorization header.
     */
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
