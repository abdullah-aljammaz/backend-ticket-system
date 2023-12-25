import { User, Ticket, Event, Categories, Payment } from "@prisma/client";
import { connectDB, prisma } from "./config/db";
import { authorize, protect } from "../src/middleware/auth";
import express, { ErrorRequestHandler, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CronJob } from "cron";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import cors from 'cors';

const app = express();
const PORT = 3005;
app.use(cors());
app.use(express.json());
connectDB();




import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "./types/userMethods";
app.post("/user/register", registerUser);
app.post("/user/login", loginUser);
app.get("/user/get_All", getAllUsers);
app.get("/user/get_By_Id/:id", getUserById);
app.delete("/user/delete/:id", deleteUser);
app.put("/user/update/:id", updateUser);

import {
  createEvent,
  getAllEvents,
  getEventById,
  getEventWithPrice,
  deleteEvent,
  updateEvent,
} from "./types/eventMethods";

app.post("/event/create", createEvent,protect,authorize("ADMIN"));
app.get("/event/get_All", getAllEvents);
app.get("/event/get_with_price", getEventWithPrice);
app.get("/event/get_By_Id/:id", getEventById);
app.delete("/event/delete/:id", deleteEvent);
app.put("/event/update/:id", updateEvent);

// Add Payment
app.post("/payment/add", async (req: Request, res: Response) => {
  let newPayment = req.body as Payment;
  await prisma.payment.create({ data: newPayment });
  res.json("Payment added");
});

app.use(function (req, res, next) {
  var err = new Error("Not Found");
  res.status(404); // using response here
  next(err);
  res.json("Page Not Found");
});

app.listen(PORT, () => {
  console.log(`Server Listing ${PORT}`);
});
