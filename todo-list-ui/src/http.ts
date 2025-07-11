import type { IToDoListItem } from "./interfaces/IToDoListItem";

export async function getToDoList(): Promise<IToDoListItem[]> {
    const response = await fetch('http://localhost:5014/ToDoList');

    if (!response.ok) {
        throw new Error('Failed to retrieve to do list');
    }

    const responseData = await response.json();

    return responseData;
}

export async function addToDoListItem(toDoListItem: IToDoListItem): Promise<string> {
    const response = await fetch('http://localhost:5014/ToDoList', {
        method: 'POST',
        body: JSON.stringify(toDoListItem),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to add new to do list item');
    }

    const newId = await response.text();
    return newId;
}

export async function markToDoItemCompleted(id: string): Promise<void> {
    const response = await fetch(`http://localhost:5014/ToDoList/complete/${id}`, {
        method: 'PATCH'
    });

    if (!response.ok) {
        throw new Error('Failed to mark to do list item complete')
    }
}

export async function deleteToDoItem(id: string): Promise<void> {
    const response = await fetch(`http://localhost:5014/ToDoList/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete to do list item')
    }
}