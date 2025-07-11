import { useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";

export default function Modal(props: PropsWithChildren<{ dialogOpen: boolean, setDialogOpen: React.Dispatch<React.SetStateAction<boolean>> }>) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if (props.dialogOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [props.dialogOpen])

    function handleDialogOnCancel() {
        props.setDialogOpen(false);
    }



    return (
        <dialog className="w-md fixed m-auto rounded-sm" ref={dialogRef} onCancel={handleDialogOnCancel}>
            {props.children}
        </dialog>
    );
}