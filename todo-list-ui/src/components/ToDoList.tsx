import { useEffect, useState } from "react";
import { getToDoList } from "../http";
import type { IToDoListItem } from "../interfaces/IToDoListItem";
import AddToDoItemForm from "./AddToDoItemForm";
import ToDoListItem from "./ToDoListItem";
import Modal from "./Modal";

export default function ToDoList() {
    const [listItems, setListItems] = useState<IToDoListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [addItemDialogOpen, setAddItemDialogOpen] = useState<boolean>(false);
    const [parentToDoListItems, setParentToDoListItems] = useState<IToDoListItem[]>([]);


    useEffect(() => {
        setIsLoading(true);

        async function fetchToDoListItems(): Promise<void> {
            try {
                const toDoItems = await getToDoList();
                setIsLoading(false);
                setListItems(toDoItems);
                setParentToDoListItems(toDoItems.filter(x => !x.parentToDoListItemId));
            }
            catch {
                setIsLoading(false);
            }
        }

        fetchToDoListItems();
    }, []);

    function handleAddNewTaskClick() {
        setAddItemDialogOpen(true);
    }

    return (
        <div>
            <button className="bg-blue-500" onClick={handleAddNewTaskClick}>Add New Task</button>
            {listItems.map(item => <ToDoListItem {...item} key={item.id} />)}

            <Modal dialogOpen={addItemDialogOpen} setDialogOpen={setAddItemDialogOpen}>
                <AddToDoItemForm dialogOpened={addItemDialogOpen} setDialogOpened={setAddItemDialogOpen} parentToDoListItems={parentToDoListItems} />
            </Modal>
        </div>
    )
}