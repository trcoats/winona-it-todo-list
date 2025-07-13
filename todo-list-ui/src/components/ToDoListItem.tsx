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

    let classNames = "card p-3 mt-2";
    if (moment().isAfter(moment(props.deadline), 'date')) {
        classNames += " bg-warning";
    }

    if ((props.taskDetails || childTasks.length > 0))
        classNames += " cursor-pointer"

    return (
        <div className={classNames} onClick={(e) => handleCardClick(e)}>
            <div className="d-flex align-items-baseline">
                <div className="d-flex align-items-center justify-content-center col-1">
                    {moment().isAfter(moment(props.deadline), 'date') && <span className="fa-solid fa-exclamation fa-2x"></span>}
                    {props.isCompleted && <span className="fa-solid fa-check text-success fa-2x"></span>}
                </div>
                <div className="d-flex flex-column col-8">
                    <div className="d-flex">
                        <label className="fw-bold me-2">To Do:</label>
                        <span>{props.toDoTask}</span>
                    </div>
                    <div className="d-flex">
                        <label className="fw-bold me-2">Deadline:</label>
                        <p>{moment(props.deadline).format('MM/DD/YYYY')}</p>
                    </div>
                    {!showDetails && props.taskDetails && childTasks.length > 0 && <span className="d-flex fst-italic">Click card to view more details and child tasks</span>}
                    {!showDetails && !props.taskDetails && childTasks.length > 0 && <span className="d-flex fst-italic">Click card to view child tasks</span>}
                    {!showDetails && props.taskDetails && childTasks.length === 0 && <span className="d-flex fst-italic">Click card to view more details</span>}
                    {showDetails && (props.taskDetails || childTasks.length > 0) && (
                        <div className="pt-1">
                            {props.taskDetails && <div className="d-flex">
                                <label className="fw-bold me-2">Details:</label>
                                <span>{props.taskDetails}</span>
                            </div>}
                            {childTasks.length > 0 && <div className="d-flex flex-column">
                                <label className="fw-bold">Child Tasks:</label>
                                {childTasks.map((childItem) => <ToDoListItem {...childItem} key={childItem.id} />)}
                            </div>}
                        </div>
                    )}
                </div>
                <div className="d-flex justify-content-end w-100">
                    {!props.isCompleted && <button className="btn btn-success me-3" onClick={handleCompleteClick}><span className="fa-solid fa-check me-2"></span> Complete</button>}
                    <button className="btn btn-danger" onClick={(e) => handleDeleteClick(e)}><span className="fa-solid fa-trash me-2"></span> Delete</button>
                </div>
            </div>
        </div >
    )
}