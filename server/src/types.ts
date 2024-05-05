export enum Priority {
    LOW,
    MEDIUM,
    HIGH
}

export enum Status {
    CREATED,
    IN_PROGRESS,
    COMPLETED,
}

export type Role = {
    name: string
    description: string
    permissions: string[]
}

export type User = {
    id: number | null
    username: string
    password: string
    email: string
    role: Role
}

export type Project = {
    id: number | null
    name: string
    description: string
    users: User[]
    tasks: Task[]
    startDate: Date
    endDate?: Date
}

export type Task = {
    id: number | null
    title: string
    description: string
    assignedTo: User
    priority: Priority
    status: Status
    dueDate: Date
}

