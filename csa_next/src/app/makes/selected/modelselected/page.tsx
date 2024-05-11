"use client";

import React, { useState, useEffect } from 'react';
import { get_models } from '@/api/api';
import { useSearchParams } from "next/navigation";
import UploadSpot from '@/components/UploadSpot';


function Makes() {
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    const model = searchParams.get('model');

    return (
        <div>
            <UploadSpot make={make as string} model={model as string} />
        </div>
    );
}

export default Makes;
