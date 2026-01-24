const corsOptions = {
  /**
   * This function is used to verify the origin of incoming requests
   * to prevent Cross-Origin Resource Sharing (CORS) attacks.
   * It checks if the origin of the request is in the list of allowedOrigins.
   * If the origin is not in the list, it returns an error.
   * @param {string} origin - the origin of the incoming request.
   * @param {function} callback - a function that will be called with the result of the check.
   */
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://127.0.0.1:5500",
      "http://localhost:5000",
      "https://elsalaf-library-frontend.vercel.app",
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};

module.exports = corsOptions;

