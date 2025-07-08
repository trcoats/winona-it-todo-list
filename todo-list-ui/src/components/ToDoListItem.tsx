import { deleteToDoItem, markToDoItemCompleted } from "../http";
import type { IToDoListItem } from "../interfaces/IToDoListItem";

export default function ToDoListItem(props: IToDoListItem) {
    async function handleMarkCompletedClick() {
        await markToDoItemCompleted(props.id ?? ''); // error handling and such
    }

    async function handleDeleteClick() {
        await deleteToDoItem(props.id ?? ''); //error handling and such;
    }

    let classNames = undefined;
    if (props.isCompleted) {
        classNames = "bg-green-200";
    } else if (new Date() > props.deadline) {
        classNames = "bg-red-200";
    }

    return (
        <div className={classNames}>
            <h4>{props.toDoTask}</h4>
            <button className="bg-green-500" onClick={handleMarkCompletedClick}>Mark Completed</button>
            <button className="bg-red-500" onClick={handleDeleteClick}>Delete</button>
        </div>
    )
}