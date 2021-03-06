const uuid = require("uuid");
const express = require("express");
const fs = require("fs");
const delay = require("express-delay");
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(delay(400));
// get all the objects
app.get("/b", (req, res) => {
  let files = [];
  const objects = fs.readdirSync("./database");
  if (!req.params.id.match(/[a-zA-Z0-9]/)) {
    return res.status(400).send({
      message: "Invalid Bin Id provided",
    });
  }
  if (objects.length === 0) {
    res.send("you have no objects");
  } else {
    try {
      for (let object of objects) {
        files.push(JSON.parse(fs.readFileSync(`./database/${object}`)));
      }
      const successMessage = {
        success: true,
        data: files,
        version: 1,
      };
      res.status(200).send(successMessage);
    } catch (error) {
      res.status(500).send("there is a problem with the server " + error);
    }
  }
});

// get a specific object by id
app.get("/b/:id", (req, res) => {
  if (!req.params.id.match(/[a-zA-Z0-9]/)) {
    return res.status(400).send({
      message: "Invalid Bin Id provided",
    });
  }
  if (!fs.existsSync(`./database/${req.params.id}.json`)) {
    return res.status(404).send(`{
            "message": "bin not found"
        }`);
  } else {
    fs.readFile(`./database/${req.params.id}.json`, (err, data) => {
      if (err) {
        res.status(500).send("there is a problem with the server " + err);
      } else {
        const body = JSON.parse(data);
        const successMessage = {
          success: true,
          data: body,
          version: 1,
          parentId: req.params.id,
        };

        res.status(200).send(successMessage);
      }
    });
  }
});

//update specific object by id
app.put("/b/:id", (req, res) => {
  const { body } = req;
  body.id = req.params.id;
  if (!req.params.id.match(/[a-zA-Z0-9]/)) {
    return res.status(400).send({
      message: "Invalid Bin Id provided",
    });
  }
  if (!fs.existsSync(`./database/${req.params.id}.json`)) {
    res.status(404).send(`{
            "message": "Bid id not found"
        }`);
  } else {
    fs.writeFile(
      `./database/${req.params.id}.json`,
      JSON.stringify(body, null, 4),
      (err) => {
        if (err) {
          res.status(500).send("there is a problem with the server " + err);
        } else {
          const successMessage = {
            success: true,
            data: body,
            version: 1,
            parentId: req.params.id,
          };
          res.status(200).send(successMessage);
        }
      }
    );
  }
});

//creating new file with new object
app.post("/b", (req, res) => {
  const { body } = req;
  const id = uuid.v4();
  if (Object.keys(body).length === 0) {
    res.status(400).send(`{
            "message": "Bin cannot be blank"
        }`);
  }
  body.id = id;
  fs.writeFile(
    `./database/${id}.json`,
    JSON.stringify(body, null, 4),
    (err) => {
      if (err) {
        res.status(500).send("there is a problem with the server " + err);
      } else {
        const successMessage = {
          success: true,
          data: body,
          version: 1,
          parentId: id,
        };

        res.status(200).send(successMessage);
      }
    }
  );
});

//deleting specific file by id
app.delete("/b/:id", (req, res) => {
  const id = req.params.id;
  if (!id.match(/[a-zA-Z0-9]/)) {
    return res.status(400).send({
      message: "Invalid Bin Id provided",
    });
  }
  if (!fs.existsSync(`./database/${id}.json`)) {
    return res.status(404).json({
      message: "Bid id not found",
    });
  } else {
    fs.unlink(`./database/${id}.json`, (err) => {
      if (err) {
        return res
          .status(500)
          .send("there is a problem with the server " + err);
      } else {
        return res.status(200).send("success");
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});
module.exports = app;
