"use client";

import { discover, like_spot } from "@/api/cars";
import Button from "@/components/Button";
import LoadingAnimation from "@/components/LoadingAnim";
import SearchSpots from "@/components/SearchSpots";
import Spotimage from "@/components/Spotimage";
import { useEffect, useMemo, useRef, useState } from "react";
import { getTimeAgo } from "@/functions/functions";
import Comments from "@/components/Comments";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

const SpotCard: React.FC<{ spot: SpotType, username: string, isAdmin: boolean }> = ({ spot, username, isAdmin }) => {
    const [shared, setShared] = useState(false);
    const [liked, setLiked] = useState(spot.likedByUser);
    const [likeCount, setLikeCount] = useState(spot.likes);

    const buildSpotLink = (spot: SpotType) =>
        `https://spots.vest.li/makes/selected/modelselected?make=${encodeURIComponent(
            spot.make
        )}&model=${encodeURIComponent(spot.model)}&username=${encodeURIComponent(
            spot.user
        )}&key=${encodeURIComponent(spot.key)}`;
    
    const spotLink = useMemo(() => buildSpotLink(spot), [spot]);

    const timeAgo = getTimeAgo(spot.uploadDate);

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
                <p className="p-1">{timeAgo}</p>
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
            <Comments username={username} spotUsername={spot.user} make={spot.make} model={spot.model} spotKey={spot.key} isAdmin={isAdmin} />
        </div>
    </div>
};
  
const DiscoverClient: React.FC<{ username: string, isAdmin: boolean }> = ({ username, isAdmin }) =>  {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    
    const [spots, setSpots] = useState<SpotType[]>([]);
    const [sort, setSort] = useState<'recent' | 'hot' | 'top'>(searchParams.get('sort') as 'recent' | 'hot' | 'top' || 'recent');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [reachEnd, setReachEnd] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true)
    const observerRef = useRef<HTMLDivElement | null>(null);
    
    const [currentSearch, setCurrentSearch] = useState<string | null>(searchParams.get('search') || null);
    
    

    useEffect(() => {
        if (!shouldFetch) return;
        if (reachEnd) return;
        if (loading) return;
      
        const getSpots = async () => {
            setLoading(true);
            try {
                const res = await discover(page, sort, currentSearch || undefined);
                setSpots((prev) => (page === 0 ? res : [...prev, ...res]));
                setPage(prevPage => prevPage + 1);
                if (res.length < 10) setReachEnd(true);
                
                const params = new URLSearchParams(searchParams.toString());

                params.set('sort', sort);
                currentSearch ? params.set('search', currentSearch) : params.delete('search');

                const newUrl = `${pathname}?${params.toString()}`;

                router.push(newUrl);
            } catch (e) {
                console.error('Error loading spots:', e);
            } finally {
                setShouldFetch(false);
                setLoading(false);
            }
        };
        
        getSpots();
    }, [page, sort, currentSearch, reachEnd, discover, shouldFetch]);
      
    useEffect(() => {
        if (reachEnd) return;
    
        const observer = new IntersectionObserver(
            entries => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting) {
                    setShouldFetch(true);
                }
            }, 
            {
                threshold: 0,
                rootMargin: "200px"
            }
        );
    
        if (observerRef.current) {
            observer.observe(observerRef.current);
        }
    
        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [reachEnd]);
    
    const onSearch = (search: string) => {
        if (search === currentSearch) return;

        setCurrentSearch(search);
        setPage(0);
        setReachEnd(false);
        setSpots([]);
        setShouldFetch(true);
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
                    setShouldFetch(true);
                }}>
                    <option value='recent'>Recent</option>
                    <option value='hot'>Hot</option>
                    <option value='top'>Top</option>
                </select>
            </div>
            {spots.length ? (
                <>
                    {spots.map((item, id) => <SpotCard 
                        username={username}
                        key={id} 
                        spot={item} 
                        isAdmin={isAdmin}
                    />)}
                    <div className='flex justify-center m-4'>
                        {reachEnd ? <p className='text-white text-xl'>No more spots.</p> 
                                  : <LoadingAnimation text='Loading spots' />}
                    </div>
                </> 
            ) : (loading || shouldFetch) ?  (
                <LoadingAnimation text='Loading spots' />
            ) : spots.length == 0 ? (
                <p className='text-white text-xl text-nowrap'>No spots found.</p>
            ) : (
                <p className='text-white text-xl text-nowrap'>Spots could not be loaded.</p>
            )}
            {!reachEnd && <div ref={observerRef} style={{ height: '1px' }} />}
        </div>
    </div>
};

export default DiscoverClient;