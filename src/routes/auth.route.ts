import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventWithPrice,
  registerUser,
loginUser,
getAllUsers,
getUserById,
deleteUser,
updateUser,
} from "../controllers/auth.controller";
import { authorize, protect } from "../middleware/auth";


const router = express.Router();
// user
router.post("/user/register",registerUser);
router.post("/user/login",loginUser);
router.get("/user/getAllUser",protect,authorize("ADMIN"),getAllUsers);
router.get("/user/get_all",protect,authorize("ADMIN"),getUserById);
router.delete("/user/delete/:id",deleteUser);
router.put("/user/delete/:id",updateUser);
// event
router.post("/event/create",protect,authorize("ADMIN"),createEvent);
router.get("/event/get_all",getAllEvents);
router.get("/event/getById/:id",protect,authorize("ADMIN"),getEventById);
router.put("/event/update/:id",protect,authorize("ADMIN"),updateEvent);
router.delete("/event/delete/:id",protect,authorize("ADMIN"),deleteEvent);
router.get("/event/",getEventWithPrice);

export default router;
