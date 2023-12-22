import { User, Ticket, Event } from "@prisma/client";
import { connectDB, prisma } from "./config/db";
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3006;

app.use(express.json());
connectDB();

// Create User
app.post("/user/create", async (req: Request, res: Response) => {
  let NewUser = req.body as User;
  await prisma.user.create({ data: NewUser });
  res.json("User Created");
});

// Update User
app.put("/user/update/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let UpdatedUser = req.body as User;
  await prisma.user.update({ where: { id: id }, data: UpdatedUser });
  res.json("User Updated");
});

// Get All User
app.get("/user/get", async (req: Request, res: Response) => {
  let all_users = await prisma.user.findMany();
  res.json(all_users);
});

// Get User with id
app.get("/user/get_with/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let user = await prisma.user.findMany({ where: { id: id },select:{id:true,username:true,email:true,password:true,role:true,phone_number:true,} });
  res.json(user);
});

// delete User
app.delete("/user/delete/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  await prisma.user.delete({ where: { id: id } });
  res.json("User Deleted");
});

// Create Event
app.post("/event/create", async (req: Request, res: Response) => {
  let NewEvent = req.body as Event;
  let check_role = prisma.user.findFirst({where:{}});
  return console.log(check_role)
  await prisma.event.create({ data: NewEvent });
  res.json("Event Created");
});

// Get All Event
app.get("/event/get_all", async (req: Request, res: Response) => {
  let all_event = await prisma.event.findMany();
  res.json(all_event);
});

// Get Ticket In Event
app.get("/event/one_event/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let one_event = await prisma.event.findMany({
    where: { id: id },
    select: {id: true, ticket: true },
  });
  res.json(one_event);
});

// Edit Event
app.put("/event/edit/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let Updated_date = req.body as Event;
  await prisma.event.update({ where: { id: id }, data: Updated_date });
  res.json("Event Updated");
});

// Delete Event
app.delete("/event/Delete/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  await prisma.event.delete({ where: { id: id } });
  res.json("Event Deleted");
});

// Create Ticket
app.post("/ticket/create", async (req: Request, res: Response) => {
  let newTicket = req.body as Ticket;
  let check_role = await prisma.user.findFirst({where:{id:newTicket.id},select:{role:true}})
  return console.log(check_role)
  await prisma.ticket.create({ data: newTicket });
  res.json("Ticket Created");
});

// Get All Ticket
app.get("/ticket/get_all", async (req: Request, res: Response) => {
  let ticket = await prisma.ticket.findMany();
  res.json(ticket);
});

// Get All Ticket
app.get("/ticket/get_one_ticket/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  let ticket = await prisma.ticket.findMany({
    where: { id: id },
  });
  res.json(ticket);
});

// Edit Ticket
app.put("/ticket/edit/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  let updateTicket = req.body as Ticket;
  await prisma.ticket.update({ where: { id: id }, data: updateTicket });
  res.json("Ticket Updated");
});

// Delete Ticket
app.delete("/ticket/Delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.ticket.delete({ where: { id: id } });
  res.json("Ticket Deleted");
});

app.listen(PORT, () => {
  console.log(`Server Listing ${PORT}`);
});
