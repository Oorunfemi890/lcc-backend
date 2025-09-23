const app = require("./express")();

const swaggerUi = require("swagger-ui-express");

const swaggerJSDoc = require("swagger-jsdoc");

// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       title: "RelationGifts API",
//       version: "1.0.0",
//       description: "A NodeJS Backedn for Relation Gifts",
//       contact: {
//         name: "Charles Onuorah", // your name
//         email: "charles.onuorah@yahoo.com", // your email
//         url: "web.com", // your website
//       },
//     },
//     license: {
//       name: "MIT",
//       url: "https://spdx.org/licenses/MIT.html",
//     },
//     servers: [
//       {
//         url: "http://localhost:3000/books",
//       },
//     ],
//   },
//   apis: ["api.js"],
// };

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RelationGift API",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Charles Onuorah",
        url: "ww.com",
        email: "charles.onuorah@yahoo.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/books",
      },
    ],
  },
  apis: ["./routes/books.js"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

var options = {
  swaggerOptions: {
    url: "http://petstore.swagger.io/v2/swagger.json",
  },
};

module.exports = function () {
  // router.use('/api-docs', swaggerUi.serve);

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, { explorer: true })
  );

  /**
   * @openapi
   * /:
   *   get:
   *     description: Welcome to swagger-jsdoc!
   *     responses:
   *       200:
   *         description: Returns a mysterious string.
   */
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  return swaggerDocs;
};
