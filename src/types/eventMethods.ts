import { User, Ticket, Event, Categories, Payment } from "@prisma/client";
import { connectDB, prisma } from "../config/db";
import express, { ErrorRequestHandler, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import cron from "node-cron";
const argon2 = require("argon2");

const app = express();
const PORT = 3006;

app.use(express.json());

// Check if User Is Admin Or not




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
