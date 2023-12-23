import { User, Ticket, Event, Categories, Payment } from "@prisma/client";
import { connectDB, prisma } from "./config/db";
import express, { ErrorRequestHandler, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CronJob } from "cron";

const app = express();
const PORT = 3006;

app.use(express.json());
connectDB();
async function deleteExpiredEvents() {
  console.log("test")
  const EventTimeEnd = await prisma.event.findMany({
    where: {
      endDate: {
        lte: new Date(),
      },
    },
  });
  if (EventTimeEnd.length > 0) {
    await prisma.event.deleteMany({
      where: {
        id: {
          in: EventTimeEnd.map((event) => event.id),
        },
      },
    });
    console.log(
      `${new Date().toISOString()} Event Is Deleted: `,
      EventTimeEnd.map((e) => e.id)
    );
  }
}

const job = new CronJob("* * * * *", async () => {
  await deleteExpiredEvents();
});
job.start();

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

// Create User In Database
app.post("/user/register", async (req: Request, res: Response) => {
  let newUser = req.body as User;
  console.log(newUser);
  await prisma.user.create({ data: newUser });
  res.json("User Created");
});

// login

app.post("/user/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as User;
  const users = await prisma.user.findFirst({
    where: { email: email, password: password },
  });
  if (users == null) {
    return res.json("Username Or Password Is Not correct");
  } else {
    return res.json("Login successfully");
  }
});

// Get All users
app.get("/user/get_all", async (req: Request, res: Response) => {
  let users = await prisma.user.findMany();
  res.json(users);
});

// Get User With Id
app.get("/user/get_with_id/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
<<<<<<< HEAD
  let user = await prisma.user.findMany({ where: { id: id }});
=======
  let user = await prisma.user.findMany({
    where: { id: id },
    include: {
      event: true,
    },
  });
>>>>>>> 9966dd57f53f2eb7e9128f6fd3d29b0422a2e2ee
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
<<<<<<< HEAD
  let admin_check = await prisma.user.findFirst({where:{id:newEvent.admin}})
  await prisma.event.create({ data: newEvent });
  res.json("event added");
=======

  const isAdminUser = await isAdmin(newEvent.admin_id);
  if (isAdminUser) {
    // User is an admin, allow event creation
    await prisma.event.create({ data: newEvent });
    return res.json("Event added");
  } else {
    // User is not an admin, deny access
    return res.json("You don't have access");
  }
>>>>>>> 9966dd57f53f2eb7e9128f6fd3d29b0422a2e2ee
});

// Get All Events
app.get("/event/get_all", async (req: Request, res: Response) => {
  let all_event = await prisma.event.findMany();
  res.json(all_event);
});

// Get Event With Id
app.get("/event/get_one/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let event = await prisma.event.findMany({ where: { id: id } });
  res.json(event);
});

// update Event
app.put("/event/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  let UpdataEvent = req.body as Event;
  const isAdminUser = await isAdmin(UpdataEvent.admin_id);
  if (isAdminUser) {
    await prisma.event.update({ where: { id: id }, data: UpdataEvent });
    res.json("Event Updated");
  } else {
    return res.json("You Dont Have Access");
  }
});

// delete Event
app.delete("/event/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  let UpdataEvent = req.body as Event;
  const isAdminUser = await isAdmin(UpdataEvent.admin_id);
  if (isAdminUser) {
    await prisma.event.delete({ where: { id: id } });
    res.json("Event Deleted");
  } else {
    return res.json("You Dont Have Access");
  }
});

// Get event With Price
app.get("/event/get_with_price/", async (req: Request, res: Response) => {
  let EventPrice = req.body as Event;
  let event = await prisma.event.findMany({
    where: { price: EventPrice.price },
  });
  return res.json(event);
});

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
