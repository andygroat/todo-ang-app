export interface Todo {
    id: string;
    description: string;
    /** ISO date string (yyyy-MM-dd). */
    dueDate?: string;
    isCompleted: boolean;
}

export interface CreateTodoRequest {
    description: string;
    dueDate?: string;
}
