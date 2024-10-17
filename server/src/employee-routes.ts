import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

employeeRouter.get("/", async (req, res) => {
  try {
    const employees = await collections.employees.find({}).toArray();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

employeeRouter.get("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const employee = await collections.employees.findOne(query);

    if (employee) {
      res.status(200).send(employee);
    } else {
      res.status(404).send(`failed to find an employee: Id ${id}`);
    }
  } catch (error) {
    res.status(404).send(`failed to find an employee: ID: ${req?.params?.id}`);
  }
});

employeeRouter.post("/", async (req, res) => {
  try {
    const employee = req.body;
    if (employee.level) {
      employee.level = employee.level.toLowerCase();
    }
    console.log("Attempting to insert employee:", employee);
    const result = await collections.employees.insertOne(employee);

    if (result.acknowledged) {
      res.status(201).send(`Created a new employee: ID ${result.insertedId}`);
    } else {
      res.status(500).send("failed to create new employee");
    }
  } catch (error) {
    console.error("Full error object:", JSON.stringify(error, null, 2));
    res.status(400).send(error.message);
  }
});

employeeRouter.put("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const employee = req.body;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await collections.employees.updateOne(query, {
      $set: employee,
    });

    if (result && result.matchedCount) {
      res.status(200).send(`Updated an employee ID ${id}`);
    } else if (!result.matchedCount) {
      res.status(404).send(`Failed to find an employee: ID ${id}`);
    } else {
      res.status(304).send(`Failed to update an employee: ID ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(404).send(error.message);
  }
});

employeeRouter.delete("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const querry = { _id: new mongodb.ObjectId(id) };
    const result = await collections.employees.deleteOne(querry);

    if (result && result.deletedCount) {
      res.status(202).send(`Removed an employee: ID ${id}`);
    } else if (!result) {
      res.status(400).send(`failed to remove an employee: ID ${id}`);
    } else {
      res.status(404).send(`Failed to find an employee: ID ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
