import express, {Request, Response} from "express";
import {Project, Task, User} from "./types";
import {FileSystemProjectDao, ProjectDao} from "./dao/ProjectDao";

const app = express();
const PORT = 3000;
const projectsFilePath = "./projects.json"; // Path to JSON file storing projects

const projectDao: ProjectDao = new FileSystemProjectDao(projectsFilePath);

app.use(express.json());


app.get("/projects", (req: Request, res: Response) => {
    const projects = projectDao.getAllProjects();
    res.json(projects);
});

app.get("/projects/:id", (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const project = projectDao.getProject(projectId);
    if (project) {
        res.json(project);
    } else {
        res.status(404).json({message: "Project not found"});
    }
});

app.post("/projects", (req: Request, res: Response) => {
    const project: Project = req.body;
    const projectId = projectDao.saveProject(project);
    res.status(201).json({id: projectId});
});

app.post("/projects/:id/tasks", (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const task: Task = req.body;
    const project = projectDao.getProject(projectId);
    if (project) {
        projectDao.addTaskToProject(project, task);
        res.status(201).json({message: "Task added successfully"});
    } else {
        res.status(404).json({message: "Project not found"});
    }
});

app.post("/projects/:id/users", (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const user: User = req.body;
    const project = projectDao.getProject(projectId);
    if (project) {
        projectDao.addUserToProject(project, user);
        res.status(201).json({message: "User added successfully"});
    } else {
        res.status(404).json({message: "Project not found"});
    }
});

app.get("/users/:userId/projects", (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const user: User = {
        id: userId,
        username: "",
        password: "",
        email: "",
        role: {name: "", description: "", permissions: []}
    };
    const projects = projectDao.getProjectsForUser(user);
    res.json(projects);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});