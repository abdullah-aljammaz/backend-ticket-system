import { User, Ticket, Event, Categories, Payment } from "@prisma/client";
import { connectDB, prisma } from "./config/db";
import express, { ErrorRequestHandler, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CronJob } from "cron";
const argon2 = require("argon2");

const app = express();
const PORT = 3005;

app.use(express.json());
connectDB();

async function deleteEventWhenFinish() {
  const eventTimeEnd = await prisma.event.findMany({
    where: {
      endDate: {
        lte: new Date(),
      },
    },
  });
  if (eventTimeEnd.length > 0) {
    await prisma.event.deleteMany({
      where: {
        id: {
          in: eventTimeEnd.map((event) => event.id),
        },
      },
    });
    console.log(
      `Event Is Deleted: `,
      eventTimeEnd.map((e) => e.id)
    );
  }
}

async function deleteDiscoubtWhenFinish() {
  const discountEnd = await prisma.event.findMany({
    where: {
      discount_end: {
        lte: new Date(),
      },
    },
  });
  if (discountEnd.map((e) => e.discount_end) == null) {
    return false;
  } else {
    for (const event of discountEnd) {
      await prisma.event.update({
        where: { id: event.id },
        data: { discount: null, discount_end: null },
      });
      console.log(
        "Discount Deleted",
        discountEnd.map((e) => e.id)
      );
    }
  }
}

const discount_timeout = new CronJob("* * * * *", async () => {
  await deleteDiscoubtWhenFinish();
});

const event_timeout = new CronJob("* * * * *", async () => {
  await deleteEventWhenFinish();
});
event_timeout.start();
discount_timeout.start();

// Check if User Is Admin Or not
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    return user?.isAdmin || false;
  } catch (error) {
    console.error("Error checking isAdmin:", error);
    return false;
  }
}

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

app.post("/event/create", createEvent);
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
