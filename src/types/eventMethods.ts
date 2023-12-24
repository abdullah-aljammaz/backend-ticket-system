import { User, Ticket, Event, Categories, Payment } from "@prisma/client";
import { connectDB, prisma } from "../config/db";
import express, { ErrorRequestHandler, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CronJob } from "cron";
const argon2 = require('argon2');

const app = express();
const PORT = 3006;

app.use(express.json());

// Check if User Is Admin Or not

export async function isAdmin(userId: string): Promise<boolean> {
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

// Create Event
export async function createEvent  (req: Request, res: Response)  {
  let newEvent = req.body as Event;
  let admin_check = await prisma.user.findFirst({
    where: { id: newEvent.admin_id },
  });
  await prisma.event.create({ data: newEvent });
  res.json("event added");
};

// Get All Events
export async function getAllEvents(req: Request, res: Response) {
  let all_event = await prisma.event.findMany();
  res.json(all_event);
};

// Get Event With Id
export async function getEventById(req: Request, res: Response) {
  let { id } = req.params;
  let event = await prisma.event.findMany({ where: { id: id } });
  res.json(event);
};

// update Event
export async function updateEvent (req: Request, res: Response)  {
  const { id } = req.params;
  let UpdataEvent = req.body as Event;
  const isAdminUser = await isAdmin(UpdataEvent.admin_id);
  if (isAdminUser) {
    await prisma.event.update({ where: { id: id }, data: UpdataEvent });
    res.json("Event Updated");
  } else {
    return res.status(403).json("Unauthorized");
  }
};

// delete Event
export async function deleteEvent (req: Request, res: Response)  {
  const { id } = req.params;
  let UpdataEvent = req.body as Event;
  const isAdminUser = await isAdmin(UpdataEvent.admin_id);
  if (isAdminUser) {
    await prisma.event.delete({ where: { id: id } });
    res.json("Event Deleted");
  } else {
    return res.status(403).json("Unauthorized");

  }
};
export async function getEventWithPrice(req: Request, res: Response){
  let EventPrice = req.body as Event;
  let event = await prisma.event.findMany({
    where: { price: EventPrice.price },
  });
  return res.json(event);
};