"use client";

import { discover, like_spot } from "@/api/cars";
import Button from "@/components/Button";
import LoadingAnimation from "@/components/LoadingAnim";
import SearchSpots from "@/components/SearchSpots";
import Spotimage from "@/components/Spotimage";
import { useEffect, useMemo, useState } from "react";

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

const SpotCard: React.FC<{ spot: SpotType }> = ({ spot }) => {
    const [shared, setShared] = useState(false);
    const [liked, setLiked] = useState(spot.likedByUser);
    const [likeCount, setLikeCount] = useState(spot.likes);
    
    const sinceUploadMs = new Date().getTime() - new Date(spot.uploadDate).getTime();
    const days = Math.floor(sinceUploadMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((sinceUploadMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((sinceUploadMs / (1000 * 60)) % 60);
    const seconds = Math.floor((sinceUploadMs / 1000) % 60);

    const buildSpotLink = (spot: SpotType) =>
        `https://spots.vest.li/makes/selected/modelselected?make=${encodeURIComponent(
          spot.make
        )}&model=${encodeURIComponent(spot.model)}&username=${encodeURIComponent(
          spot.user
        )}&key=${encodeURIComponent(spot.key)}`;
    
    const spotLink = useMemo(() => buildSpotLink(spot), [spot]);

    const timeAgo = days
        ? `${days} ${days === 1 ? 'day' : 'days'}`
        : hours
        ? `${hours} ${hours === 1 ? 'hour' : 'hours'}`
        : minutes
        ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
        : `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;

    const onLike = () => {
        const prevLiked = liked;
        const prevLikeCount = likeCount;

        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        like_spot(spot.make, spot.model, spot.key, spot.user).catch(error => {
            setLiked(prevLiked);
            setLikeCount(prevLikeCount);

            console.error('Error liking the spot:', error);
        });
    };

    const onView = () => {
        window.open(
            spotLink,
            '_blank',
            'noopener noreferrer'
        );
    }

    const onShare = () => {
        navigator.clipboard.writeText(spotLink);
        setShared(true);
    }
    
    return <div className="bg-white w-max">
        <div className="border-b border-black mx-1 mt-1">
            <p className="text-center text-2xl">
                {spot.make} {spot.model}
            </p>
        </div>
        <div className="w-min">
            <div className="flex">
                <p className="p-1">
                    Uploaded by{' '}
                    <a
                        href={`https://spots.vest.li/makes?username=${spot.user}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {spot.user}
                    </a>
                </p>
                <p className="p-1">•</p>
                <p className="p-1">{timeAgo} ago</p>
            </div>
            <Spotimage 
                images={spot.images.map((img) => `https://images.vest.li${img}`)} 
                tags={spot.tags} 
                notes={spot.notes} 
                date={spot.date}
            />
            <div className="flex items-center mb-1 gap-2">
                <p className="p-1 text-xl">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</p>
                <Button text={liked ? 'Remove like' : 'Like'} className="py-1" onClick={onLike} />
                <Button text="View" className="py-1" onClick={onView} />
                <Button text={shared ? "Link copied" : "Share"} className="py-1" onClick={onShare} />
            </div>
        </div>
    </div>
};
  
const DiscoverClient = () => {
    const [spots, setSpots] = useState<SpotType[]>([]);
    const [sort, setSort] = useState<'recent' | 'hot' | 'top'>("recent");
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(0);
    const [reachEnd, setReachEnd] = useState(false);

    const [currentSearch, setCurrentSearch] = useState<string | null>(null);

    // Loading of spots, with pagination
    useEffect(() => {
        let active = true;       
        
        async function load() {
            if (!active) return;
            setLoading(true);
            
            console.log('Loading spots:', page, sort, currentSearch);
            
            try {
                const res = await discover(page, sort, currentSearch || undefined);
                if (!active) return;
                
                if (page === 0) {
                    setSpots(res);
                } else {
                    setSpots(prevSpots => [...prevSpots, ...res]);
                }
    
                if (res.length < 10) setReachEnd(true);
            } catch (error) {
                console.error('Error loading spots:', error);
            } finally {
                setLoading(false);
            }
        }

        load();
        return () => { active = false };
    }, [sort, page, currentSearch]);

    const onSearch = (search: string) => {
        console.log('Searching for:', search);

        if (search === currentSearch) return;

        setPage(0);
        setReachEnd(false);
        setSpots([]);
        setCurrentSearch(search);
    }

    return <div className='flex flex-col gap-4 items-center mt-4 font-ListComponent'>
        <div className='w-full max-w-96'>
            <div className='mb-2'>
                <SearchSpots onSearch={onSearch} />
                <p className='text-white'>Sort by</p>
                <select value={sort} onChange={e => {
                    setSort(e.target.value as 'recent' | 'hot' | 'top');
                    setPage(0);
                    setReachEnd(false);
                    setSpots([]);
                }}>
                    <option value='recent'>Recent</option>
                    <option value='hot'>Hot</option>
                    <option value='top'>Top</option>
                </select>
            </div>
            {spots.length ? (
                <>
                    {spots.map((item, id) => <SpotCard 
                        key={id} 
                        spot={item} 
                    />)}
                    <div className='flex justify-center m-4'>
                        {reachEnd ? <p className='text-white text-xl'>No more spots.</p> 
                                  : loading ? <LoadingAnimation text='Loading spots' /> 
                                            : <Button text='Load more' onClick={() => setPage(page + 1)} />}
                    </div>
                </> 
            ) : loading ?  (
                <LoadingAnimation text='Loading spots' />
            ) : spots.length == 0 ? (
                <p className='text-white text-xl text-nowrap'>No spots found.</p>
            ) : (
                <p className='text-white text-xl text-nowrap'>Spots could not be loaded.</p>
            )}
        </div>
    </div>
};

export default DiscoverClient;