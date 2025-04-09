import connectionDB from "./DB/connectionDB.js";
import commentRouter from "./modules/comments/comment.controller.js";
import postRouter from "./modules/posts/post.controller.js";
import userRouter from "./modules/users/user.controller.js";
import { AppError, globalErrorHandler } from "./utilits/error/index.js";
import path from "path"
import cors from "cors"
import chatRouter from "./modules/chat/chat.controller.js";
const bootstrap = (app, express) => {
  // console.log(path.resolve("uploads"));
  app.use(cors());
  app.use("/uploads",express.static(path.resolve("uploads")))
// middleware for passing request body
  app.use(express.json());
  //connect to database
  connectionDB();
   // Home route
   app.get("/", (req, res, next) => {
    return res.status(200).json({message:"hello on social app"})
   });
  
  //application routes
  app.use("/users", userRouter);
  app.use("/posts", postRouter);
  app.use("/comments", commentRouter);
  app.use("/chat", chatRouter);


  //routes for unhandeled request
  app.use("*", (req, res, next) => {
    return next(new AppError(`invalid url ${req.originalUrl}`,404));
  });
 //global Error Handler
  app.use(globalErrorHandler);
};
export default bootstrap;
