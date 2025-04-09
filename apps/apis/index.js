import { createUser, getUsers, ConnectDB } from "db-services";
import express from "express";

const app = express();

app
  .route("/")
  .get(async (_req, res) => {
    const users = await getUsers();
    res.status(200).send({ success: true, users });
  })
  .post(async (req, res) => {
    const { name, email } = req.body;
    const newUser = await createUser({ name, email });
    res.status(201).send({ success: true, user: newUser });
  });

ConnectDB()
  .then(() => {
    app.listen(8088, () => {
      console.log("App listening on port 8088");
    });
  })
  .catch((error) => {
    console.log("Something went wrong!", error.message);
  });
