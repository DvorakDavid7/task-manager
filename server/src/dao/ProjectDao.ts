import {Project, Task, User} from "../types";
import fs from "fs"

export interface ProjectDao {
    saveProject(project: Project): number

    getProject(projectId: number): Project

    addTaskToProject(project: Project, task: Task): void

    addUserToProject(project: Project, user: User): void

    getProjectsForUser(user: User): Project[]

    getAllProjects(): Project[]
}

export class FileSystemProjectDao implements ProjectDao {
    private readonly projectsFilePath: string;

    constructor(projectsFilePath: string) {
        this.projectsFilePath = projectsFilePath;
    }

    saveProject(project: Project): number {
        const projects = this.getAllProjects();
        const projectId = projects.length > 0 ? projects[projects.length - 1].id + 1 : 1;
        project.id = projectId;
        projects.push(project);
        this.saveAllProjects(projects);
        return projectId;
    }

    getProject(projectId: number): Project {
        const projects = this.getAllProjects();
        return projects.find(project => project.id === projectId);
    }

    addTaskToProject(project: Project, task: Task): void {
        project.tasks.push(task);
        this.updateProject(project);
    }

    addUserToProject(project: Project, user: User): void {
        project.users.push(user);
        this.updateProject(project);
    }

    getProjectsForUser(user: User): Project[] {
        const projects = this.getAllProjects();
        return projects.filter(project => project.users.some(u => u.id === user.id));
    }

    getAllProjects(): Project[] {
        try {
            const projectsData = fs.readFileSync(this.projectsFilePath, 'utf-8');
            return JSON.parse(projectsData);
        } catch (error) {
            return [];
        }
    }

    private saveAllProjects(projects: Project[]): void {
        fs.writeFileSync(this.projectsFilePath, JSON.stringify(projects, null, 2), 'utf-8');
    }

    private updateProject(project: Project): void {
        const projects = this.getAllProjects();
        const index = projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
            projects[index] = project;
            this.saveAllProjects(projects);
        }
    }
}