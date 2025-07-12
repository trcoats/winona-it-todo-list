import { useContext, useState } from "react";
import { deleteToDoItem, markToDoItemCompleted } from "../http";
import type { IToDoListItem } from "../interfaces/IToDoListItem";
import moment from 'moment';
import { ToDoListContext } from "../store/ToDoListContext";

export default function ToDoListItem(props: IToDoListItem) {
    const toDoListCtx = useContext(ToDoListContext);
    const [showDetails, setShowDetails] = useState(false);

    const childTasks = toDoListCtx.toDoListItems.filter(x => x.parentToDoListItemId === props.id);

    async function handleCompleteClick(e: React.MouseEvent) {
        e.stopPropagation();
        try {
            await markToDoItemCompleted(props.id ?? '');
            toDoListCtx.markItemCompleted(props.id ?? '');
        } catch (error) {
            if (error instanceof Error) {
                toDoListCtx.onError(error);
            } else {
                toDoListCtx.onError(new Error('An unexpected error occurred while attempting to mark item complete'))
            }
        }

    }

    async function handleDeleteClick(e: React.MouseEvent) {
        e.stopPropagation();
        try {
            await deleteToDoItem(props.id ?? ''); //error handling and such;
            toDoListCtx.deleteToDoListItem(props.id ?? '');
        } catch (error) {
            if (error instanceof Error) {
                toDoListCtx.onError(error);
            } else {
                toDoListCtx.onError(new Error('An unexpected error occurred while attempting to delete item'))
            }
        }
    }

    async function handleCardClick(e: React.MouseEvent) {
        e.stopPropagation();
        setShowDetails(!showDetails);
    }

    let classNames = "border-1 rounded-sm mb-3 py-3 px-4 flex align-baseline";
    if (props.isCompleted) {
        classNames += " bg-green-200";
    } else if (moment().isAfter(moment(props.deadline), 'date')) {
        classNames += " bg-red-200";
    }

    if ((props.taskDetails || childTasks.length > 0))
        classNames += " cursor-pointer"

    return (
        <div className={classNames} onClick={(e) => handleCardClick(e)}>
            <div className="flex flex-col w-3/4">
                <div className="flex">
                    <label className="font-semibold me-2">To Do:</label>
                    <h4>{props.toDoTask}</h4>
                </div>
                <div className="flex">
                    <label className="font-semibold me-2">Deadline:</label>
                    <p>{moment(props.deadline).format('MM/DD/YYYY')}</p>
                </div>
                {!showDetails && props.taskDetails && childTasks.length > 0 && <span className="flex italic">Click card to view more details and child tasks</span>}
                {!showDetails && !props.taskDetails && childTasks.length > 0 && <span className="flex italic">Click card to view child tasks</span>}
                {!showDetails && props.taskDetails && childTasks.length === 0 && <span className="flex italic">Click card to view more details</span>}
                {showDetails && (props.taskDetails || childTasks.length > 0) && (
                    <div className="pt-5">
                        {props.taskDetails && <div className="flex">
                            <label className="font-semibold me-2">Details:</label>
                            <span>{props.taskDetails}</span>
                        </div>}
                        {childTasks.length > 0 && <div className="cursor-default flex flex-col">
                            <label className="text-left font-semibold me-2">Child Tasks:</label>
                            {childTasks.map((childItem) => <ToDoListItem {...childItem} key={childItem.id} />)}
                        </div>}
                    </div>
                )}
            </div>
            <div className="flex justify-end w-100">
                {!props.isCompleted && <button className="cursor-pointer bg-green-500 rounded-xs font-semibold h-10 w-1/2" onClick={handleCompleteClick}>Complete</button>}
                <button className="cursor-pointer ms-2 bg-red-500 rounded-xs text-white font-semibold h-10 w-1/2" onClick={(e) => handleDeleteClick(e)}>Delete</button>
            </div>
        </div>
    )
}