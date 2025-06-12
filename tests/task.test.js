const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const Task = require("../models/Task");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Task API", () => {
  beforeEach(async () => {
    await Task.deleteMany({});
  });

  describe("GET /api/tasks", () => {
    it("should return empty array when no tasks exist", async () => {
      const res = await chai.request(app).get("/api/tasks");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });

    it("should return all tasks", async () => {
      const task = new Task({
        title: "Test Task",
        description: "Test Description",
      });
      await task.save();

      const res = await chai.request(app).get("/api/tasks");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array").with.lengthOf(1);
      expect(res.body[0].title).to.equal("Test Task");
    });
  });

  describe("POST /api/task", () => {
    it("should create a new task", async () => {
      const taskData = {
        title: "New Task",
        description: "New Description",
      };

      const res = await chai.request(app).post("/api/task").send(taskData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("title", "New Task");
      expect(res.body).to.have.property("description", "New Description");
      expect(res.body).to.have.property("completed", false);
    });

    it("should not create task without title", async () => {
      const taskData = {
        description: "New Description",
      };

      const res = await chai.request(app).post("/api/task").send(taskData);

      expect(res).to.have.status(400);
    });
  });

  describe("PUT /api/task/:id", () => {
    it("should update a task", async () => {
      const task = new Task({
        title: "Original Task",
        description: "Original Description",
      });
      await task.save();

      const updateData = {
        title: "Updated Task",
        completed: true,
      };

      const res = await chai
        .request(app)
        .put(`/api/task/${task._id}`)
        .send(updateData);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("title", "Updated Task");
      expect(res.body).to.have.property("completed", true);
    });
  });

  describe("DELETE /api/task/:id", () => {
    it("should delete a task", async () => {
      const task = new Task({
        title: "Task to Delete",
        description: "Will be deleted",
      });
      await task.save();

      const res = await chai.request(app).delete(`/api/task/${task._id}`);

      expect(res).to.have.status(200);

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).to.be.null;
    });
  });
});
