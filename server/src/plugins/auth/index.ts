import {
  Application,
  Router,
  ErrorRequestHandler,
  RequestHandler,
} from "express";
import session from "express-session";
import { IUserRepo, UserRepo } from "@data";
import { hashFunction, matchPassword } from "./helpers";

declare module "express-session" {
  interface SessionData {
    user: any;
  }
}

const userRepo: IUserRepo = new UserRepo();

export class Auth {
  constructor(app: Application) {
    app.use(
      session({
        secret: process.env.COOKIE_SECRET || "somesecret",
        resave: false, // https://github.com/expressjs/session?tab=readme-ov-file#resave
        saveUninitialized: false, // https://github.com/expressjs/session?tab=readme-ov-file#saveuninitialized
        cookie: {
          signed: true,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24,
          sameSite: "strict",
          path: "/",
        },
      })
    );

    const router = Router();
    router.post("/signup", this.signup);
    router.post("/login", this.login);
    router.get("/current_user", this.getCurrentUser);
    router.use(this.handleError);

    app.use("/api/auth", router);

    console.log("Auth plugin registered");
  }

  signup: RequestHandler = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
      let user = await userRepo.findByEmail(email);
      if (user) {
        throw { status: 422, message: "Email already used." };
      }

      const { hashedPassword, salt } = await hashFunction(password);
      user = await userRepo.create({ name, email, hashedPassword, salt });

      req.session.user = { id: user._id, email: user.email, name: user.name };
      res.json({ data: req.session.user });
    } catch (err) {
      next(err);
    }
  };

  login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        throw { status: 401, message: "Incorrect email or password." };
      }

      if (!(await matchPassword(password, user.hashedPassword, user.salt))) {
        throw { status: 401, message: "Incorrect email or password." };
      }

      req.session.user = { id: user._id, email: user.email, name: user.name };
      res.json({ data: req.session.user });
    } catch (err) {
      next(err);
    }
  };

  getCurrentUser: RequestHandler = (req, res) => {
    res.json({ data: req.session.user || null });
  };

  handleError: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    console.log("Destroying session");
    req.session.destroy(console.error);
    res.status(err.status || 500).json({ error: err.message });
  };
}