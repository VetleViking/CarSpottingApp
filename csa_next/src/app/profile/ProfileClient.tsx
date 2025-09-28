"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import { delete_user, logout } from "@/api/users";

export default function ProfileClient() {
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("Delete profile");

    function deleteHandler() {
        if (!deleteConfirm) {
            setDeleteMessage("Are you sure?");
            setDeleteConfirm(true);
            return;
        }
        delete_user().then(() => {
            logout().then(() => {
                window.location.href = "/login";
            });
        });
    }

    function logoutHandler() {
        logout().then(() => {
            window.location.href = "/login";
        });
    }

    return (
        <div>
            <Button onClick={deleteHandler} text={deleteMessage} className="text-xl mx-4" />
            <Button onClick={logoutHandler} text="Logout" className="text-xl" />
        </div>
    );
}
