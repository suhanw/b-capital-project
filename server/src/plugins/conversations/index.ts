import {
  Application,
  Router,
  RequestHandler,
  ErrorRequestHandler,
} from "express";
import { IConversationRepo, ConversationRepo } from "@data";
import { requireLogin } from "../auth/helpers";

const conversationRepo: IConversationRepo = new ConversationRepo();

export class Conversations {
  constructor(app: Application) {
    const router = Router();
    router.use(requireLogin);
    router.post("/", this.createConversation);
    router.put("/:conversationId", this.updateConversation);
    router.get("/", this.getConversations);
    router.get("/:conversationId", this.getConversation);
    router.use(this.handleError);

    app.use("/api/conversations", router);

    console.log("Conversations plugin registered");
  }

  createConversation: RequestHandler = async (req, res, next) => {
    try {
      const { id: userId } = req.session.user || {};
      const { messages, title } = req.body;

      const conversation = await conversationRepo.create({
        title,
        messages,
        user: userId,
      });

      res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  };

  getConversation: RequestHandler = async (req, res, next) => {
    try {
      const { conversationId } = req.params;
      const { id: userId } = req.session.user || {};
      const conversation = await conversationRepo.findById(
        conversationId,
        userId
      );

      if (!conversation) {
        throw { status: 404, message: "Conversation not found." };
      }

      res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  };

  getConversations: RequestHandler = async (req, res, next) => {
    try {
      const { id: userId } = req.session.user || {};

      const conversations = await conversationRepo.findByUser(userId);

      res.json({ data: conversations });
    } catch (err) {
      next(err);
    }
  };

  updateConversation: RequestHandler = async (req, res, next) => {
    try {
      const { id: userId } = req.session.user || {};
      const { conversationId } = req.params;
      const { title, messages } = req.body;

      const conversation = await conversationRepo.update({
        _id: conversationId,
        user: userId,
        title,
        messages,
      });

      if (!conversation) {
        throw { status: 422, message: "Conversation not updated." };
      }

      res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  };

  handleError: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  };
}