const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path"); // Core Node.js utility for absolute path mapping

// CRITICAL FOR VERCEL: Force the serverless builder to actively include the docs file in the bundle
require("./swaggerDocs");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Expense Tracker API",
      version: "1.0.0",
      description:
        "Production ready backend engine supporting secure multi-user transaction management.",
    },
    // REMOVED LOCALHOST: Dropped the local server array item so the dropdown locks perfectly to production
    servers: [
      {
        url: "https://gullak-beta.vercel.app",
        description: "Production Deployed URL (Vercel)",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  // Leverages absolute path resolution so the JSDoc comments are read inside the Vercel workspace environment
  apis: [path.join(__dirname, "swaggerDocs.js")],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = { swaggerUi: require("swagger-ui-express"), swaggerSpec };
