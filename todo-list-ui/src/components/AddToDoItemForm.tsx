import * as React from "react";
import { useState, useContext } from "react";
import { addToDoListItem } from "../http";
import type { IToDoListItem } from "../interfaces/IToDoListItem";
import moment from 'moment'
import { ToDoListContext } from "../store/ToDoListContext";

export default function AddToDoItemForm(props: { dialogOpened: boolean, setDialogOpened: React.Dispatch<React.SetStateAction<boolean>> }) {
    const toDoListCtx = useContext(ToDoListContext);
    const [toDoTask, setToDoTask] = useState<string>('');
    const [taskDeadline, setTaskDeadline] = useState<string>('');
    const [parentTaskId, setParentTaskId] = useState<string | undefined>(undefined);
    const [taskDetails, setTaskDetails] = useState<string | undefined>(undefined);
    const [dateError, setDateError] = useState<string | undefined>(undefined);

    const today = moment().format('YYYY-MM-DD');
    const parentToDoItems = toDoListCtx.toDoListItems.filter(x => !x.parentToDoListItemId && !x.isCompleted);

    function handleToDoTaskChange($event: React.ChangeEvent<HTMLInputElement>) {
        setToDoTask($event.target.value);
    }

    function handleTaskDeadlineChange($event: React.ChangeEvent<HTMLInputElement>) {
        setTaskDeadline($event.target.value);
    }

    function handleTaskDeadlineBlur($event: React.FocusEvent<HTMLInputElement>) {
        const inputDate = moment($event.target.value, "YYYY-MM-DD");
        const validDate = inputDate.isValid();

        if (!validDate) {
            setDateError("Date not in valid format");
        } else if (moment().isAfter(inputDate, 'date')) {
            setDateError("Date must be in the future");
        } else {
            setDateError(undefined);
        }
    }

    function handleParentTaskIdChange($event: React.ChangeEvent<HTMLSelectElement>) {
        setParentTaskId($event.target.value);
    }

    function handleTaskDetailsChange($event: React.ChangeEvent<HTMLTextAreaElement>) {
        setTaskDetails($event.target.value);
    }

    async function handleSubmitClick($event: React.MouseEvent) {
        $event.preventDefault();

        const parentTaskModel: IToDoListItem = {
            toDoTask: toDoTask,
            deadline: moment(taskDeadline).toDate(),
            isCompleted: false,
            taskDetails: taskDetails,
            parentToDoListItemId: parentTaskId ?? ''
        };

        try {
            const newId = await addToDoListItem(parentTaskModel);
            toDoListCtx.addToDoListItem({ id: newId, ...parentTaskModel });
            props.setDialogOpened(false);
        } catch (err) {
            if (err instanceof Error)
                toDoListCtx.onError(err);
            else
                toDoListCtx.onError(new Error('An unexpected error occurred while attempting to add list item'))
        }
    }

    function handleCancelClick($event: React.MouseEvent) {
        $event.preventDefault();
        props.setDialogOpened(false);
    }

    let parentToDoItemSelect = null;
    if (parentToDoItems?.length > 0) {
        parentToDoItemSelect = (
            <div className="d-flex flex-column align-items-start mb-2">
                <label className="fw-bold">Parent Task</label>
                <select className="form-select" value={parentTaskId} onChange={(e) => handleParentTaskIdChange(e)}>
                    <option value={undefined}></option>
                    {parentToDoItems.map(x => {
                        return <option value={x.id} key={x.id}>{x.toDoTask}</option>
                    })}
                </select>
            </div>
        )
    }

    return (
        <form className="d-flex flex-column p-4">
            <div className="d-flex flex-column align-items-start mb-2">
                <label className="fw-bold">To Do Task<span className="ms-1 text-danger">*</span></label>
                <input className="form-control" type="text" placeholder="Task" value={toDoTask} onChange={(e) => handleToDoTaskChange(e)} />
            </div>
            <div className="d-flex flex-column align-items-start mb-2">
                <label className="text-left fw-bold">Deadline<span className="ms-1 text-danger">*</span></label>
                <input className="form-control" type="date" min={today} value={taskDeadline} onChange={(e) => handleTaskDeadlineChange(e)} onBlur={(e) => handleTaskDeadlineBlur(e)} />
            </div>
            {parentToDoItemSelect}
            <div className="d-flex flex-column align-items-start mb-4">
                <label className="fw-bold">Task Details</label>
                <textarea className="form-control" value={taskDetails} onChange={(e) => handleTaskDetailsChange(e)}></textarea>
            </div>

            {dateError && <div className="text-danger">{dateError}</div>}

            <div className="d-flex justify-content-between mb-2">
                <button className="btn btn-outline-primary" onClick={(e) => handleCancelClick(e)}>Cancel</button>
                <button disabled={!toDoTask || !taskDeadline || !!dateError} className="btn btn-primary" onClick={(e) => handleSubmitClick(e)}>Submit</button>
            </div>
        </form>
    )
}