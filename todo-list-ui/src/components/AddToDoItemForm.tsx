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

    const today = moment().format('YYYY-MM-DD');
    const parentToDoItems = toDoListCtx.toDoListItems.filter(x => !x.parentToDoListItemId && !x.isCompleted);

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
            deadline: moment(taskDeadline).toDate(),
            isCompleted: false,
            taskDetails: taskDetails,
            parentToDoListItemId: parentTaskId
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
            <div className="flex flex-col mb-2">
                <label className="text-left font-semibold">Parent Task</label>
                <select className="border-1 rounded-xs w-1/2 px-1" value={parentTaskId} onChange={(e) => handleParentTaskIdChange(e)}>
                    <option value={undefined}></option>
                    {parentToDoItems.map(x => {
                        return <option value={x.id} key={x.id}>{x.toDoTask}</option>
                    })}
                </select>
            </div>
        )
    }

    return (
        <form className="flex flex-col p-4">
            <div className="flex flex-col mb-2">
                <label className="text-left font-semibold">To Do Task<span className="ms-1 text-red-500">*</span></label>
                <input className="border-1 rounded-xs px-1" type="text" placeholder="Task" value={toDoTask} onChange={(e) => handleToDoTaskChange(e)} />
            </div>
            <div className="flex flex-col mb-2">
                <label className="text-left font-semibold">Deadline<span className="ms-1 text-red-500">*</span></label>
                <input className="border-1 rounded-xs w-1/2 px-1" type="date" min={today} value={taskDeadline} onChange={(e) => handleTaskDeadlineChange(e)} />
            </div>
            {parentToDoItemSelect}
            <div className="flex flex-col justify-start mb-8">
                <label className="text-left font-semibold">Task Details</label>
                <textarea className="border-1 rounded-xs px-1" value={taskDetails} onChange={(e) => handleTaskDetailsChange(e)}></textarea>
            </div>

            <div className="flex justify-between mb-2">
                <button className="cursor-pointer w-7/16 h-10 bg-white border-1 border-blue-500 text-blue-500 font-semibold rounded-sm" onClick={(e) => handleCancelClick(e)}>Cancel</button>
                <button disabled={!toDoTask || !taskDeadline} className="cursor-pointer w-7/16 bg-blue-500 font-semibold text-white rounded-sm disabled:bg-gray-200 disabled:text-black disabled:cursor-default" onClick={(e) => handleSubmitClick(e)}>Submit</button>
            </div>
        </form>
    )
}