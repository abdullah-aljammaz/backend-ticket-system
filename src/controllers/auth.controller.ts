import { User, Ticket, Event, Categories, Payment } from "@prisma/client";
import { connectDB, prisma } from "../config/db";
import express, { ErrorRequestHandler, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import cron from "node-cron";
import * as jwt from "jsonwebtoken";
const argon2 = require("argon2");
const app = express();
app.use(express.json());


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
    }
  }
}


cron.schedule("* * * * *", () => {
  deleteEventWhenFinish();
  deleteDiscoubtWhenFinish();
});
app.get("/events", async (req, res) => {
  const events = await prisma.event.findMany();
  res.json(events);
});
// Create Event
export async function createEvent(req: Request, res: Response) {
  let newEvent = req.body as Event;
  await prisma.event.create({ data: newEvent });
  res.json("event added");
}

// Get All Events
export async function getAllEvents(req: Request, res: Response) {
  let all_event = await prisma.event.findMany();
  res.json(all_event);
}

// Get Event With Id
export async function getEventById(req: Request, res: Response) {
  let { id } = req.params;
  let event = await prisma.event.findMany({ where: { id: id } });
  res.json(event);
}

// update Event
export async function updateEvent(req: Request, res: Response) {
  const { id } = req.params;
  let UpdataEvent = req.body as Event;

  await prisma.event.update({ where: { id: id }, data: UpdataEvent });
  res.json("Event Updated");
}

// delete Event
export async function deleteEvent(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.event.delete({ where: { id: id } });
  res.json("Event Deleted");
}
export async function getEventWithPrice(req: Request, res: Response) {
  let EventPrice = req.body as Event;
  let event = await prisma.event.findMany({
    where: { price: EventPrice.price },
  });
  return res.json(event);
}

// Create User In Database
export async function registerUser(req: Request, res: Response) {
  const newUser = req.body as User;
  const hashedPassword = await argon2.hash(newUser.password);
  newUser.password = hashedPassword;
  await prisma.user.create({
    data: newUser,
  });
  return res.status(201).json({
    message: "Welcome to the website ! , user added !",
  });
}

// login

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body as User;
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({
      message: "Wrong email or password",
    });
  }

  const isValidPassword = await argon2.verify(user.password, password);

  if (!isValidPassword) {
    return res.status(400).json({
      message: "Wrong email or password",
    });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECERT as string
  );

  return res.status(200).json({
    message: `Welcome back ! ${email}`,
    token,
  });
}


// Get All users
export async function getAllUsers(req: Request, res: Response) {
  let users = await prisma.user.findMany();
  res.json(users);
}
// Get User With Id
export async function getUserById(req: Request, res: Response) {
  let { id } = req.params;
  let user = await prisma.user.findMany({
    where: { id: id },
    include: { event: true },
  });
  res.json(user);
}

// Delete User
export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: id } });
  res.json("delete done");
}

// Update User
export async function updateUser(req: Request, res: Response) {
  let { id } = req.params;
  let newDataUser = req.body as User;
  await prisma.user.update({ where: { id: id }, data: newDataUser });
  res.json("Updated done");
}

// add payment

export async function addPayment(req: Request, res: Response)  {
  let newPayment = req.body as Payment;
  await prisma.payment.create({ data: newPayment });
  res.json("Payment added");
};
