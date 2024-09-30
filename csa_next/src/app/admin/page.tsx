"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { Suspense } from 'react'
import { ensure_login } from '@/functions/functions';
import Button from '@/components/Button';
import { check_admin } from '@/api/users';
import { regnr_info, update_spots } from '@/api/cars';
import LoadingAnimation from '@/components/LoadingAnim';

function AdminComponent() {
    const [username, setUsername] = useState("");
    const [regnr, setRegnr] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const regnr_info_debug = async (regnr: string) => {
        const response = await fetch(`https://www.vegvesen.no/ws/no/vegvesen/kjoretoy/felles/datautlevering/enkeltoppslag/kjoretoydata?kjennemerke=${regnr}`, {
            method: 'GET',
            headers: {
                "SVV-Authorization": `ApiKey 81291eee-051f-4f30-bb64-c4b8a9558226`
            }
        });

        console.log(response);
    }

    async function oppslag(kjennemerke: string) {
        let kjoretoy = null;
        let url = 'https://www.vegvesen.no/ws/no/vegvesen/kjoretoy/felles/datautlevering/enkeltoppslag/kjoretoydata?kjennemerke=' + kjennemerke;
        let headers = {
                "SVV-Authorization": "Apikey {key}"
            };
        ;
    
        console.log('Kaller REST-tjeneste: ' + url);
        let response = await fetch(url, { method: "GET", headers: headers });
    
        console.log('HTTP Status: ' + response.status + ' (' + response.statusText + ')');
    
        if (response.status === 200) {
            kjoretoy = await response.json();
        }
    
        return kjoretoy;
    }
    

    if (!username) ensure_login().then(setUsername);

    if (username && !isAdmin) check_admin(username).then(res => {!res.is_admin ? window.location.href = '/' : setIsAdmin(true)});

    return <div>
        <Header username={username} />
        <Button
            onClick={update_spots}
            text='Update spots'
            className='text-xl m-4'
        />
        <div className='flex flex-col w-min'>
            <input type="text" placeholder='regnr' value={regnr} onChange={e => setRegnr(e.target.value)} />
            <Button
                onClick={() => regnr_info(regnr)}
                text='Get regnr info'
                className='text-xl m-4'
            />
        </div>
    </div>
}

export default function Admin() {
    return <Suspense fallback={<LoadingAnimation text='Loading'/>}>
        <AdminComponent />
    </Suspense>
};
