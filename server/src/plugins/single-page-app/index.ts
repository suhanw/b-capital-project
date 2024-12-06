import { Application } from "express";

const CLIENT_BUNDLE_URL = process.env.CLIENT_BUNDLE_URL;

export class SinglePageApp {
  constructor(app: Application) {
    app.get("/", (req, res) => {
      res.contentType("text/html").send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>My Chatbot</title>
          </head>
          <body>
            <div id="root"></div>
            <script src="${CLIENT_BUNDLE_URL}"></script>
          </body>
        </html>
      `);
    });
  }
}
