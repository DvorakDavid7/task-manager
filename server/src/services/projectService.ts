import {Priority, Project, Status, Task, User} from "../types";
import {ProjectDao} from "../dao/ProjectDao";

export class ProjectService {
    private projectDao: ProjectDao

    constructor(projectDao: ProjectDao) {
        this.projectDao = projectDao
    }

    createNewProject(user: User, name: string, description: string, startDate?: Date, endDate?: Date): void {
        const project: Project = {
            name: name,
            description: description,
            startDate: startDate,
            endDate: endDate,
            tasks: [],
            users: [user]
        }
        this.projectDao.saveProject(project)
    }

    createNewTask(projectId: number, title: string, description: string, priority: Priority, dueDate: Date): void {
        const project = this.projectDao.getProject(projectId)
        const task: Task = {
            title: title,
            description: description,
            status: Status.CREATED,
            priority: priority,
            dueDate: dueDate
        }

        this.projectDao.addTaskToProject(project, task)
    }

    assignUserToProject(user: User, projectId: number) {
        const project = this.projectDao.getProject(projectId)

        this.projectDao.adduserToProject(project, user)
    }

    getProjectsForUser(user: User): Project[] {
        return this.projectDao.getProjectsForUser(user)
    }
}

