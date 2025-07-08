import type { IToDoListItem } from "./interfaces/IToDoListItem";

export async function getToDoList(): Promise<IToDoListItem[]> {
    const response = await fetch('http://localhost:5014/ToDoList');
    const responseData = await response.json();

    return responseData;
}

export async function addToDoListItem(toDoListItem: IToDoListItem): Promise<void> {
    await fetch('http://localhost:5014/ToDoList', {
        method: 'POST',
        body: JSON.stringify(toDoListItem),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export async function markToDoItemCompleted(id: string): Promise<void> {
    await fetch(`http://localhost:5014/ToDoList/complete/${id}`, {
        method: 'PATCH'
    });
}

export async function deleteToDoItem(id: string): Promise<void> {
    await fetch(`http://localhost:5014/ToDoList/${id}`, {
        method: 'DELETE'
    });
}