import { User } from "@prisma/client";
import { connectDB, prisma } from "../config/db";
import express, { ErrorRequestHandler, Request, Response } from "express";
import { authorize, protect } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";
import { CronJob } from "cron";
import * as jwt from "jsonwebtoken";
const argon2 = require("argon2");

const app = express();
const PORT = 3006;

app.use(express.json());

// Check if User Is Admin Or not

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
