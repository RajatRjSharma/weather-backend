import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [{ url: "http://localhost:3000/api" }],
    tags: [
      // Add this tags array to order the tags
      {
        name: "Users",
        description: "User management and authentication",
      },
      {
        name: "Cities",
        description: "City search and discovery endpoints",
      },
      {
        name: "Weather",
        description: "Weather and forcast endpoints",
      },
      {
        name: "SavedCities",
        description: "User saved cities management",
      },
      {
        name: "Other",
        description:
          "Tourism attractions and points of interest and Local news and current events",
      },

      // Add other tag groups here in the desired order
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // path to your route files with annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
