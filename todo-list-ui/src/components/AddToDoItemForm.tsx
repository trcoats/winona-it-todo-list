import * as React from "react";
import { useState } from "react";
import { addToDoListItem } from "../http"
import type { IToDoListItem } from "../interfaces/IToDoListItem"

export default function AddToDoItemForm(props: { dialogOpened: boolean, setDialogOpened: React.Dispatch<React.SetStateAction<boolean>>, parentToDoListItems: IToDoListItem[] }) {
    const [toDoTask, setToDoTask] = useState<string>('');
    const [taskDeadline, setTaskDeadline] = useState<string>('');
    const [parentTaskId, setParentTaskId] = useState<string | undefined>(undefined);
    const [taskDetails, setTaskDetails] = useState<string | undefined>(undefined);

    function handleToDoTaskChange($event: React.ChangeEvent<HTMLInputElement>) {
        setToDoTask($event.target.value);
    }

    function handleTaskDeadlineChange($event: React.ChangeEvent<HTMLInputElement>) {
        setTaskDeadline($event.target.value);
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
            deadline: new Date(taskDeadline),
            isCompleted: false,
            taskDetails: taskDetails,
            parentToDoListItemId: parentTaskId
        };

        await addToDoListItem(parentTaskModel);
    }

    function handleCancelClick($event: React.MouseEvent) {
        $event.preventDefault();
        props.setDialogOpened(false);
    }

    let parentToDoItemSelect = null;
    if (props.parentToDoListItems?.length > 0) {
        parentToDoItemSelect = (
            <select value={parentTaskId} onChange={(e) => handleParentTaskIdChange(e)}>
                <option value={undefined}></option>
                {props.parentToDoListItems.map(x => {
                    return <option value={x.id} key={x.id}>{x.toDoTask}</option>
                })}
            </select>
        )
    }

    return (
        <form className="flex flex-col">
            <input type="text" placeholder="Task" value={toDoTask} onChange={(e) => handleToDoTaskChange(e)} />
            <input type="datetime-local" value={taskDeadline} onChange={(e) => handleTaskDeadlineChange(e)} />
            {parentToDoItemSelect}
            <textarea value={taskDetails} onChange={(e) => handleTaskDetailsChange(e)}></textarea>

            <div className="flex">
                <button className="bg-white rounded-sm" onClick={(e) => handleCancelClick(e)}>Cancel</button>
                <button className="bg-blue-500 rounded-sm" onClick={(e) => handleSubmitClick(e)}>Submit</button>
            </div>
        </form>
    )
}