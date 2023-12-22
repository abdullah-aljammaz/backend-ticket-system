import { User, Ticket, Event, Categories, Payment } from "@prisma/client";
import { connectDB, prisma } from "./config/db";
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3006;

app.use(express.json());
connectDB();

// Create User In Database
app.post("/user/create", async (req: Request, res: Response) => {
  let newUser = req.body as User;
  console.log(newUser);
  await prisma.user.create({ data: newUser });
  res.json("User Created");
});

// Get All users
app.get("/user/get_all", async (req: Request, res: Response) => {
  let users = await prisma.user.findMany();
  res.json(users);
});

// Get User With Id
app.get("/user/get_with_id/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let user = await prisma.user.findMany({ where: { id: id },select:{id:true,email:true,firstName:true,lastName:true,role:true,phone:true,createdAt:true,updatedAt:true,payments:true}});
  res.json(user);
});

// Delete User
app.delete("/user/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: id } });
  res.json("delete done");
});

// Update User
app.put("/user/update/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let newDataUser = req.body as User;
  await prisma.user.update({ where: { id: id }, data: newDataUser });
  res.json("Updated done");
});

// Create Event
app.post("/event/create", async (req: Request, res: Response) => {
  let newEvent = req.body as Event;
  await prisma.event.create({ data: newEvent });
  res.json("event added");
});

// Add Payment
app.post("/payment/add", async (req: Request, res: Response) => {
  let newPayment = req.body as Payment;
  await prisma.payment.create({ data: newPayment });
  res.json("Payment added");
});

app.listen(PORT, () => {
  console.log(`Server Listing ${PORT}`);
});
