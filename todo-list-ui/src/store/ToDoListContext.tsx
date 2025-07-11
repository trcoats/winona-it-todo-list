import { createContext, useReducer, type ReactNode } from "react";
import type { IToDoListItem } from "../interfaces/IToDoListItem";
import moment from 'moment';

export const ToDoListContext = createContext<
    {
        toDoListItems: IToDoListItem[],
        setToDoListItems: (items: IToDoListItem[]) => void,
        addToDoListItem: (item: IToDoListItem) => void,
        markItemCompleted: (id: string) => void,
        deleteToDoListItem: (id: string) => void
        error: Error | undefined,
        onError: (error: Error | undefined) => void
    }>
    ({
        toDoListItems: [],
        setToDoListItems: () => { },
        addToDoListItem: () => { },
        markItemCompleted: () => { },
        deleteToDoListItem: () => { },
        error: undefined,
        onError: () => { }
    });

function sortItems(items: IToDoListItem[]) {
    items.sort((a, b) => {
        if (moment(a.deadline).isBefore(moment(b.deadline), 'date')) {
            return -1;
        } else if (moment(b.deadline).isBefore(moment(a.deadline), 'date')) {
            return 1;
        } else {
            return (a.toDoTask < b.toDoTask) ? -1 : 1;
        }
    });

    return items;
}

export function toDoListReducer(state: { items: IToDoListItem[], error: Error | undefined }, action: { type: string, payload: IToDoListItem | IToDoListItem[] | string | Error | undefined }) {
    if (action.type === 'ON_ERROR') {
        state.error = action.payload as Error;

        return { ...state };
    }

    const stateCopy = { ...state };

    if (action.type === 'SET_ITEMS') {
        const items = action.payload as IToDoListItem[];

        stateCopy.items = sortItems(items);
    }

    if (action.type === 'ADD_ITEM') {
        stateCopy.items = sortItems([...stateCopy.items, action.payload as IToDoListItem]);
    }

    if (action.type === 'UPDATE_ITEM') {
        const itemIdx = stateCopy.items.findIndex(x => x.id === action.payload as string);
        const item = stateCopy.items[itemIdx];
        item.isCompleted = true;

        stateCopy.items.splice(itemIdx, 1, item)

        stateCopy.items = [...state.items];

        if (item.parentToDoListItemId) {
            const childrenItems = stateCopy.items.filter(x => x.parentToDoListItemId === item.parentToDoListItemId);
            if (!childrenItems.some(x => !x.isCompleted)) {
                const parentItemIdx = stateCopy.items.findIndex(x => x.id === item.parentToDoListItemId);
                const parentItem = stateCopy.items[parentItemIdx];
                parentItem.isCompleted = true;

                stateCopy.items.splice(parentItemIdx, 1, parentItem);

                stateCopy.items = [...stateCopy.items];
            }
        }
    }

    if (action.type === 'DELETE_ITEM') {
        const items = stateCopy.items.filter(x => x.id !== action.payload as string);

        stateCopy.items = items;

        if (stateCopy.items.some(x => x.parentToDoListItemId === action.payload as string)) {
            const itemsWithChildrenRemoved = stateCopy.items.filter(x => x.parentToDoListItemId !== action.payload as string);
            stateCopy.items = itemsWithChildrenRemoved;
        }
    }

    return stateCopy;
}

export default function ToDoListContextProvider({ children }: { children: ReactNode }) {
    const [toDoListState, dispatch] = useReducer(toDoListReducer, { items: [], error: undefined })

    function handleSetToDoListItems(items: IToDoListItem[]) {
        dispatch({
            type: 'SET_ITEMS',
            payload: items
        })
    }

    function handleAddNewToDoItem(item: IToDoListItem) {
        dispatch({
            type: 'ADD_ITEM',
            payload: item
        });
    }

    function handleItemMarkedComplete(id: string) {
        dispatch({
            type: 'UPDATE_ITEM',
            payload: id
        });
    }

    function handleDeleteItem(id: string) {
        dispatch({
            type: 'DELETE_ITEM',
            payload: id
        });
    }

    function handleError(error: Error | undefined) {
        dispatch({
            type: 'ON_ERROR',
            payload: error
        });
    }

    const toDoListCtx = {
        toDoListItems: toDoListState.items,
        setToDoListItems: handleSetToDoListItems,
        addToDoListItem: handleAddNewToDoItem,
        markItemCompleted: handleItemMarkedComplete,
        deleteToDoListItem: handleDeleteItem,
        error: toDoListState.error,
        onError: handleError,
    }

    return <ToDoListContext.Provider value={toDoListCtx}>{children}</ToDoListContext.Provider>
}