import { useContext, useEffect, useState } from "react";
import { getToDoList } from "../http";
import AddToDoItemForm from "./AddToDoItemForm";
import ToDoListItem from "./ToDoListItem";
import Modal from "./Modal";
import { ToDoListContext } from "../store/ToDoListContext";
import ErrorBanner from "./ErrorBanner";

export default function ToDoList() {
    const toDoListCtx = useContext(ToDoListContext)
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [addItemDialogOpen, setAddItemDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);

        async function fetchToDoListItems(): Promise<void> {
            try {
                const toDoItems = await getToDoList();
                toDoListCtx.setToDoListItems(toDoItems);
                setIsLoading(false);
            }
            catch (error) {
                if (error instanceof Error) {
                    toDoListCtx.onError(error);
                } else {
                    toDoListCtx.onError(new Error('An unexpected error occurred'));
                }

                setIsLoading(false);
            }
        }

        fetchToDoListItems();
    }, []);

    function handleAddNewTaskClick() {
        setAddItemDialogOpen(true);
    }

    const parentToDoItems = toDoListCtx.toDoListItems.filter(x => !x.parentToDoListItemId);

    return (
        <>
            <ErrorBanner />
            {isLoading && <p>Loading...</p>}
            {!isLoading && (
                <>
                    <div className="flex justify-end pb-5">
                        <button className="bg-blue-500 rounded-sm text-white font-semibold w-30 h-10 cursor-pointer justify-end" onClick={handleAddNewTaskClick}>Add New Task</button>
                    </div>

                    {parentToDoItems.length === 0 && <div>Click the "Add New Task" button to add a new ToDo List Task!</div>}
                    {parentToDoItems.length > 0 && parentToDoItems.map(item => <ToDoListItem {...item} key={item.id} />)}

                    <Modal dialogOpen={addItemDialogOpen} setDialogOpen={setAddItemDialogOpen}>
                        {addItemDialogOpen && <AddToDoItemForm dialogOpened={addItemDialogOpen} setDialogOpened={setAddItemDialogOpen} />}
                    </Modal>
                </>
            )}
        </>
    )
}