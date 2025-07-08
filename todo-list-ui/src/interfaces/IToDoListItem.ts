export interface IToDoListItem {
    id?: string;
    toDoTask: string,
    deadline: Date,
    isCompleted: boolean,
    taskDetails?: string,
    parentToDoListItemId?: string
}
