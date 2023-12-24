import { User } from "@prisma/client";
import { connectDB, prisma } from "../config/db";
import express, { ErrorRequestHandler, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CronJob } from "cron";
const argon2 = require('argon2');

const app = express();
const PORT = 3006;

app.use(express.json());


// Check if User Is Admin Or not

export async function isAdmin(userId: string,req:Request,res:Response): Promise<boolean> {
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
export async function  registerUser(req: Request, res: Response) {
  let newUser = req.body as User;
  console.log(newUser);
  try {
    const hash = await argon2.hash(newUser.password);
    newUser.password = hash
    await prisma.user.create({ data: newUser });
    res.json("User Created");
  } catch (err) {
    res.json("Error Create Acount")
  }

};

// login

export async function loginUser (req: Request, res: Response) {
  const { email, password } = req.body as User;

  try {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
      if (!user) {
        return res.json("Username Or Password Is Not correct");
      }
      // Verify password using Argon2
    let passwordMatch = await argon2.verify(user.password,password);
    if (passwordMatch) {
      // Login successful
      return res.json("Login successfully");
    } else {
      return res.json("Username Or Password Is Not correct");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json("Internal server error");
  }
};

// Get All users
export async function getAllUsers (req: Request, res: Response) {
  let users = await prisma.user.findMany();
  res.json(users);
};

// Get User With Id
export async function getUserById (req: Request, res: Response) {
  let { id } = req.params;
  let user = await prisma.user.findMany({ where: { id: id },include:{event:true}});
  res.json(user);
};

// Delete User
export async function deleteUser (req: Request, res: Response) {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: id } });
  res.json("delete done");
};

// Update User
export async function updateUser (req: Request, res: Response) {
  let { id } = req.params;
  let newDataUser = req.body as User;
  await prisma.user.update({ where: { id: id }, data: newDataUser });
  res.json("Updated done");
};