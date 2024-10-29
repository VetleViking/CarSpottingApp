"use client";

import { discover, like_spot } from "@/api/cars";
import Button from "@/components/Button";
import LoadingAnimation from "@/components/LoadingAnim";
import Spotimage from "@/components/Spotimage";
import { useEffect, useState } from "react";

const DiscoverClient = () => {
    const [spots, setSpots] = useState<{
        date: string;
        images: string[];
        key: string;
        notes: string;
        tags: string[];
        user: string;
        make: string;
        model: string;
        likes: number;
        uploadDate: string;
        likedByUser: boolean;
    }[]>([]);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState<'recent' | 'hot' | 'top'>("recent");
    const [prevPage, setPrevPage] = useState(0);
    const [reachEnd, setReachEnd] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true) 
       
        if (page == prevPage) {
            setSpots([])
        }

        let active = true
        load()
        return () => { active = false }

        async function load() {
            const res = await discover(page, sort)
            if (!active) { return }
            if (page !== prevPage) {
                setPrevPage(page)
                if (res.length === 0) {
                    setReachEnd(true)
                } else {
                    setSpots(s => s.concat(res))
                }
            } else {
                setSpots(res)
            }
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, page])

    return <div className='flex flex-col gap-4 items-center mt-4 font-ListComponent'>
        <div className='w-min'>
            <div className='mb-2'>
                <p className='text-white'>Sort by</p>
                <select value={sort} onChange={e => {
                    setSort(e.target.value as 'recent' | 'hot' | 'top')
                    setPage(0)
                    setReachEnd(false)
                }}>
                    <option value='recent'>Recent</option>
                    <option value='hot'>Hot</option>
                    <option value='top'>Top</option>
                </select>
            </div>
            {spots.length ? <>{spots.map((item, id) => {
                const sinceUploadMs = new Date().getTime() - new Date(item.uploadDate).getTime()
                const sinceUpload = {
                    days: Math.floor(sinceUploadMs / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(sinceUploadMs / (1000 * 60 * 60)),
                    minutes: Math.floor(sinceUploadMs / (1000 * 60)),
                    seconds: Math.floor(sinceUploadMs / (1000))
                }

                return <div key={id} className='bg-white w-max'>
                    <div className='border-b border-black mx-1 mt-1'>
                        <p className='text-center text-2xl '>{item.make} {item.model}</p>
                    </div>
                    <div>
                        <div className='flex'>
                            <p className='p-1'>
                                Uploaded by <a href={`http://spots.vest.li/makes?username=${item.user}`} target="_blank" rel="noopener noreferrer" className='text-initial'>{item.user}</a>
                            </p>
                            <p className='p-1'>•</p>
                            <p className='p-1'>
                                {sinceUpload.days > 0 ? `${sinceUpload.days} ${sinceUpload.days === 1 ? "day" : "days"}` :
                                    sinceUpload.hours > 0 ? `${sinceUpload.hours} ${sinceUpload.hours === 1 ? "hour" : "hours"}` :
                                        sinceUpload.minutes > 0 ? `${sinceUpload.minutes} ${sinceUpload.minutes === 1 ? "minute" : "minutes"}` :
                                            `${sinceUpload.seconds} ${sinceUpload.seconds === 1 ? "second" : "seconds"}`} ago
                            </p>
                        </div>
                        <Spotimage
                            images={item.images.map(image => `https://images.vest.li${image}`)} tags={item.tags} notes={item.notes} date={item.date} />
                        <div className='flex items-center mb-1 gap-2'>
                            <p className='p-1 text-xl'>{item.likes} {item.likes == 1 ? "like" : "likes"}</p>
                            <Button text={item.likedByUser ? "Remove like" : "Like"} className='py-1' onClick={() => {
                                like_spot(item.make, item.model, item.key, item.user).then(() => {
                                    setSpots(spots.map(spot => {
                                        return spot.make === item.make && spot.model === item.model && spot.key === item.key && spot.user === item.user
                                            ? { ...spot, likedByUser: !spot.likedByUser, likes: spot.likedByUser ? spot.likes - 1 : spot.likes + 1 }
                                            : spot;
                                    }));
                                })
                            }} />
                            <Button text='View' className='py-1' onClick={() => {
                                window.open(`/makes/selected/modelselected?make=${item.make}&model=${item.model}&username=${item.user}`)
                            }} />
                            {/*<Button text='share' className='py-1' onClick={() => { // not working until site is https
                                navigator.clipboard.writeText(`http://spots.vest.li/makes/selected/modelselected?make=${item.make}&model=${item.model}&username=${item.user}`)
                            }} />*/}
                        </div>
                    </div>
                </div>
            })}
                <div className='flex justify-center m-4'>
                    {reachEnd ? <p className='text-white text-xl'>No more spots.</p> : loading ? <LoadingAnimation text='Loading spots' /> : <Button text='Load more' onClick={() => setPage(page + 1)} />}
                </div></> : loading ? <LoadingAnimation text='Loading spots' /> : <p className='text-white text-xl text-nowrap'>Spots could not be loaded.</p>}
        </div>
    </div>
};

export default DiscoverClient;