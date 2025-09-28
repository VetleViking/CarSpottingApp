"use client";

import CreateReleaseNotes from "@/components/CreateReleaseNotes";
import AddAdmin from "@/components/AddAdmin";
import { update_users } from "@/api/users";
import { update_spots } from "@/api/cars";
import Button from "@/components/Button";
import React from "react";

export default function AdminClientSide({ currentVersion }: { currentVersion: string }) {
    return (
        <div className="flex flex-col items-center gap-8">
            <div className="flex flex-row justify-center">
                <Button onClick={update_spots} text="Update spots" className="text-xl m-4" />
                <Button onClick={update_users} text="Update users" className="text-xl m-4" />
            </div>
            <div className="flex flex-col items-center gap-8 m-8">
                <AddAdmin />
                <CreateReleaseNotes currentVersion={currentVersion} />
            </div>
        </div>
    );
}
