"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoadingAnimation from "@/components/LoadingAnim";
import SearchSpots from "@/components/SearchSpots";
import { discover } from "@/api/cars";
import FullSpot from "@/components/FullSpot";

export default function DiscoverClient({ username, isAdmin }: { username: string; isAdmin: boolean }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    
    const [spots, setSpots] = useState<Spot[]>([]);
    const [sort, setSort] = useState<'recent' | 'hot' | 'top'>(searchParams.get('sort') as 'recent' | 'hot' | 'top' || 'recent');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [reachEnd, setReachEnd] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true)
    const observerRef = useRef<HTMLDivElement | null>(null);
    
    const [currentSearch, setCurrentSearch] = useState<string | null>(searchParams.get('search') || null);
    const [search, setSearch] = useState<string>(searchParams.get('search') || '');
    
    useEffect(() => {
        if (!shouldFetch || reachEnd || loading) return;
      
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

                router.push(newUrl, { scroll: false });
            } catch (e) {
                console.error('Error fetching spots:', e);
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

    return (
        <div className='flex flex-col gap-4 items-center mt-4 font-ListComponent'>
            <div className='w-full max-w-96'>
                <div className='mb-2'>
                    <SearchSpots onSearch={onSearch} search={search} setSearch={setSearch} />
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
                        {spots.map((item, id) => <FullSpot 
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
    );
};
