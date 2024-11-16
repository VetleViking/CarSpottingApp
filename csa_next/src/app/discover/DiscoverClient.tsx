"use client";

import { discover, like_spot } from "@/api/cars";
import Button from "@/components/Button";
import LoadingAnimation from "@/components/LoadingAnim";
import Spotimage from "@/components/Spotimage";
import { useEffect, useState } from "react";

interface SpotType {
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
}

const SpotCard = ({ item, onLike, onView, onShare }: { 
        item: SpotType; 
        onLike: () => void; 
        onView: () => void; 
        onShare: () => void; 
}) => {
    const sinceUploadMs = new Date().getTime() - new Date(item.uploadDate).getTime();
    const sinceUpload = {
        days: Math.floor(sinceUploadMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor(sinceUploadMs / (1000 * 60 * 60)),
        minutes: Math.floor(sinceUploadMs / (1000 * 60)),
        seconds: Math.floor(sinceUploadMs / 1000),
    };
    const timeAgo = sinceUpload.days
        ? `${sinceUpload.days} ${sinceUpload.days === 1 ? 'day' : 'days'}`
        : sinceUpload.hours
        ? `${sinceUpload.hours} ${sinceUpload.hours === 1 ? 'hour' : 'hours'}`
        : sinceUpload.minutes
        ? `${sinceUpload.minutes} ${sinceUpload.minutes === 1 ? 'minute' : 'minutes'}`
        : `${sinceUpload.seconds} ${sinceUpload.seconds === 1 ? 'second' : 'seconds'}`;
    
    return (
        <div className="bg-white w-max">
            <div className="border-b border-black mx-1 mt-1">
                <p className="text-center text-2xl">
                    {item.make} {item.model}
                </p>
            </div>
            <div>
                <div className="flex">
                    <p className="p-1">
                    Uploaded by{' '}
                    <a
                        href={`http://spots.vest.li/makes?username=${item.user}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-initial"
                    >
                        {item.user}
                    </a>
                    </p>
                    <p className="p-1">•</p>
                    <p className="p-1">{timeAgo} ago</p>
                </div>
                <Spotimage images={item.images.map((img) => `https://images.vest.li${img}`)} tags={item.tags} notes={item.notes} date={item.date} />
                <div className="flex items-center mb-1 gap-2">
                    <p className="p-1 text-xl">{item.likes} {item.likes === 1 ? 'like' : 'likes'}</p>
                    <Button text={item.likedByUser ? 'Remove like' : 'Like'} className="py-1" onClick={onLike} />
                    <Button text="View" className="py-1" onClick={onView} />
                    <Button text="Share" className="py-1" onClick={onShare} />
                </div>
            </div>
        </div>
    );
};
  
const DiscoverClient = () => {
    const [spots, setSpots] = useState<SpotType[]>([]);
    const [sort, setSort] = useState<'recent' | 'hot' | 'top'>("recent");
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(0);
    const [prevPage, setPrevPage] = useState(0);
    const [reachEnd, setReachEnd] = useState(false);

    useEffect(() => {
        setLoading(true) 
       
        if (page == prevPage) setSpots([]);

        let active = true;
        load();
        return () => { active = false };

        async function load() {
            const res = await discover(page, sort)
            if (!active) { return }
            
            if (page !== prevPage) {
                setPrevPage(page)
                
                if (res.length === 0) setReachEnd(true)
                else setSpots(s => s.concat(res))
            } else  setSpots(res);
            
            setLoading(false);
        }
    }, [sort, page])

    const handleLike = (id: number) => {
        const spot = spots[id];
        like_spot(spot.make, spot.model, spot.key, spot.user).then(() => {
            setSpots((s) =>
                s.map((spot, i) =>
                    i === id
                        ? { ...spot, likedByUser: !spot.likedByUser, likes: spot.likes + (spot.likedByUser ? -1 : 1) }
                        : spot
                )
            );
        });
    };

    const handleView = (id: number) => {
        window.open(`http://spots.vest.li/makes?spot=${spots[id].key}`, "_blank");
    };

    const handleShare = (id: number) => {
        window.open(`http://spots.vest.li/makes?spot=${
            spots[id].key
        }`, "_blank");
    }

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
            {spots.length ? <>{spots.map((item, id) => <SpotCard 
                key={id} 
                item={item} 
                onLike={() => handleLike(id)} 
                onView={() => handleView(id)} 
                onShare={() => handleShare(id)}
            />)}
            <div className='flex justify-center m-4'>
                {reachEnd ? <p className='text-white text-xl'>No more spots.</p> : loading ? <LoadingAnimation text='Loading spots' /> : <Button text='Load more' onClick={() => setPage(page + 1)} />}
            </div></> : loading ? <LoadingAnimation text='Loading spots' /> : <p className='text-white text-xl text-nowrap'>Spots could not be loaded.</p>}
        </div>
    </div>
};

export default DiscoverClient;