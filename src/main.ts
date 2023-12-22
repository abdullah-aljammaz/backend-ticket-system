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
let all_users = await prisma.user.findMany()
res.json(all_users)
});


// Get User with id
app.get("/user/get_with/:id", async (req: Request, res: Response) => {
let {id} = req.params
let user = await prisma.user.findMany({where:{id:id}})
res.json(user)
});

// delete User
app.delete("/user/delete/:id", async (req: Request, res: Response) => {
  let {id} = req.params
  await prisma.user.delete({where:{id:id}})
  res.json("User Deleted")
  });
  

// Create Event
app.post("/event/create", async (req: Request, res: Response) => {
  let NewUser = req.body as User;
  await prisma.user.create({ data: NewUser });
  res.json("User Created");
});



app.listen(PORT, () => {
  console.log(`Server Listing ${PORT}`);
});
