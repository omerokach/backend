  const request = require("supertest");
  const app = require("./index.js");

  describe("GET route", () => {
    const body = {
        "my-todo": [
       {
           "text": "omer",
           "date": "2021-02-21 10:28:43",
           "priority": "1"
       } ],
       "id": "10"
   }
    const expectedRes = {
        success: true,
        data: body,
        "version": 1,
        "parentId": "test"
    };
  
    const expectedError = {
        message: "Invalid Bin Id provided"
    };
    const expectedInvalidId = {
        message: "bin not found"
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
    it("Sholud return an  error message with status code 404 for bin not found", async () => {
        const response = await request(app).get("/b/0c7");
        // Is the status code 400
        expect(response.status).toBe(404);
        // Is success:false
        expect(response.body.success).toBe(expectedError.success);
    
      });
  });
  
  describe("POST route", () => {
    const taskToPost = {
        "my-todo": []
    };
    const expectedResponse = {
            success: true,
            data: taskToPost,
            "version": 1,
    };
    it("Should post a new bin successfuly", async () => {
      const response = await request(app).post("/b").send(taskToPost);
      expect(response.status).toBe(200);

      await request(app).get(`./database/${response.body.data.id}`).expect(200);
    });
  });