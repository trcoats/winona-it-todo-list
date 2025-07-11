import { useContext, useEffect, useState } from "react"
import { ToDoListContext } from "../store/ToDoListContext";

export default function ErrorBanner() {
    const toDoCtx = useContext(ToDoListContext);
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (toDoCtx.error) {
            setShow(true);
        };

        const timerId = setTimeout(() => {
            setShow(false);
        }, 3000);

        return () => clearTimeout(timerId);
    }, [toDoCtx.error])


    if (!show) {
        return undefined;
    }

    return (
        <div className="w-full bg-red-500 fixed top-0 left-0">{toDoCtx.error?.message ?? 'An unexpected error occurred'}</div>
    )
}