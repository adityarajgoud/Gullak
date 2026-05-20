const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Expense Tracker API",
      version: "1.0.0",
      description:
        "Production ready backend engine supporting secure multi-user transaction management.",
    },
    servers: [
      { url: "http://localhost:5000", description: "Local Development Server" },
      {
        url: "https://your-deployed-app.railway.app",
        description: "Production Deployed URL",
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
  apis: ["./utils/swaggerDocs.js"], // Grouping documentation syntax separately to keep code clean!
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = { swaggerUi: require("swagger-ui-express"), swaggerSpec };
