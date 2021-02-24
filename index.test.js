const request = require("supertest");
const app = require("./index");
const fs = require("fs");
afterAll(() => {
  fs.appendFileSync("./database/test1.json", "test!");
});

describe("GET route", () => {
  const body = {
    "my-todo": [
      {
        text: "omer",
        date: "2021-02-21 10:28:43",
        priority: "1",
      },
    ],
    id: "test",
  };
  const expectedRes = {
    success: true,
    data: body,
    version: 1,
    parentId: "test",
  };

  const expectedError = {
    message: "Invalid Bin Id provided",
  };
  const expectedInvalidId = {
    message: "bin not found",
  };

  it("Should return a bin by a given id", async () => {
    const response = await request(app).get("/b/test");
    // Is the status code 200
    expect(response.status).toBe(200);
    // Is success:true
    expect(response.body.success).toBe(expectedRes.success);
    // Is the body equal expectedRes
    expect(response.body.data).toEqual(body);
  });

  it("Sholud return an  error message with status code 400 for illegal id", async () => {
    const response = await request(app).get("/b/%");
    // Is the status code 400
    expect(response.status).toBe(400);
    // Is success:false
    expect(response.body.success).toBe(expectedError.success);
  });
  it("Should return an  error message with status code 404 for bin not found", async () => {
    const response = await request(app).get("/b/0c7");
    // Is the status code 400
    expect(response.status).toBe(404);
    // Is success:false
    expect(response.body.success).toBe(expectedError.success);
  });
});

describe("PUT route", () => {
  const taskToPost = {
    "my-todo": [
      {
        text: "omer",
        date: "2021-02-21 10:28:43",
        priority: "1",
      },
    ],
    id: "10",
  };
  const files = [
    "0ca801d3-cb6d-4850-800b-106644034807.json",
    "test.json",
    "test1.json",
  ];
  it("Should update bin successfully by given id", async () => {
    const response = await request(app).put("/b/test").send(taskToPost);
    expect(response.status).toBe(200);
  });

  it("should not creat new bin when updating", async () => {
    const afterPut = fs.readdirSync("./database");
    expect(afterPut).toEqual(files);
  });

  it("should error if invalid id", async () => {
    const response = await request(app).put("/b/*").send(taskToPost);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Bin Id provided");
  });
});

// describe("POST route", () => {
//   afterAll(() => {
//     const files = fs.readdirSync("./database");
//     for(let i =0; i<files.length; i++){
//       if(files[i] !== "0ca801d3-cb6d-4850-800b-106644034807.json" && files[i] !== "test.json"){
//         fs.unlinkSync(`./database/${files[i]}`)
//       }
//     }

//   });
//   const taskToPost = {
//     "my-todo": []
//   };
//   it("Should post a new bin successfully", async () => {
//     const response = await request(app).post("/b").send(taskToPost);
//     expect(response.status).toBe(200);
//     await request(app).get(`./database/${response.body.data.id}`).expect(200);
//   });
// });

describe("DELETE route", () => {
  it("Should delete bin by given id", async () => {
    const response = await request(app).delete("/b/test1").expect(200).and(done);
    console.log(response);
    expect(response.status).toBe(200);
    // await request(app).get(`./database/${response.body.data.id}`).expect(400);
  });
});
