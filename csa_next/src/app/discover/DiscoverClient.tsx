"use client";

import { add_comment, discover, get_comments, like_spot } from "@/api/cars";
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

const getTimeAgo = (date: string) => {
    const sinceUploadMs = new Date().getTime() - new Date(date).getTime();
    const days = Math.floor(sinceUploadMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((sinceUploadMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((sinceUploadMs / (1000 * 60)) % 60);
    const seconds = Math.floor((sinceUploadMs / 1000) % 60);

    return days
        ? `${days} ${days === 1 ? 'day' : 'days'} ago`
        : hours
        ? `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
        : minutes
        ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
        : `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
}

interface NestedComment {
    commentId: string;
    parentId?: string;
    comment: string;
    date: string;
    user: string;
    children?: NestedComment[];
}

const Comments: React.FC<{username: string, spotUsername: string, make: string, model: string, spotKey: string}> = ({ username, spotUsername, make, model, spotKey }) => {
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');

    function buildCommentTree(comments: NestedComment[]): NestedComment[] {
        const map: Record<string, NestedComment> = {};
        const roots: NestedComment[] = [];
      
        comments.forEach((c) => {
            map[c.commentId] = { ...c, children: [] };
        });
      
        comments.forEach((c) => {
            if (c.parentId && map[c.parentId]) {
                map[c.parentId].children?.push(map[c.commentId]);
            } else {
                roots.push(map[c.commentId]);
            }
        });
      
        return roots;
    }

    function renderComment(comment: NestedComment, username: string) {
        const timeAgo = getTimeAgo(comment.date);
        return (
            <div key={comment.commentId} className="px-1 mt-2 border-l-2 border-black">
                <p>
                    <a
                        href={`https://spots.vest.li/makes?username=${comment.user}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {comment.user === username ? "You" : comment.user}
                    </a>{" "}
                    • {timeAgo}
                </p>
                <p>{comment.comment}</p>
                <Button text="Reply" onClick={() => onComment(comment.commentId)} />
                {comment.children &&
                    comment.children.map((child) => renderComment(child, username))
                }
            </div>
        );
    }

    const onComment = (parent?: string) => {
        if (!newComment) return;

        add_comment(spotUsername, make, model, spotKey, newComment, parent).then(() => {
            setComments(prev => [...prev, { 
                comment: newComment, 
                parentId: parent, 
                date: new Date().toISOString(),
                user: username 
            }]);
            setNewComment('');
        }).catch(error => {
            console.error('Error adding comment:', error);
        });
    }

    const getComments = () => {
        get_comments(spotUsername, make, model, spotKey).then((res) => {
            setComments(res);
        }).catch(error => {
            console.error('Error getting comments:', error);
        });
    }

    return (
        <div className='w-full'>
            <div className='flex justify-between'>
                <p className='text-xl'>Comments</p>
                <Button 
                    text={open ? 'Close' : 'Open'} 
                    onClick={() => {
                        if (!open) getComments();    
                        setOpen(!open)
                    }} 
                />
            </div>
            {open && <div className='bg-white p-2'>
                <div className='flex gap-2'>
                <textarea 
                    className='w-full p-1 border border-black rounded' 
                    value={newComment} 
                    onChange={e => setNewComment(e.target.value)} 
                    placeholder='Write a comment...'
                />
                <Button text='Comment' className="h-min" onClick={() => onComment()} />
                </div>
                <div className="my-2">
                    {Array.isArray(comments) && comments.length > 0 ? (
                        buildCommentTree(comments).map((comment) => (
                        renderComment(comment, username)
                        ))
                    ) : (
                        <p className="text-center ">No comments. Be the first to comment!</p>
                    )}
                </div>
            </div>}
        </div>
    );
}

const SpotCard: React.FC<{ spot: SpotType, username: string }> = ({ spot, username }) => {
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

    const timeAgo = getTimeAgo(spot.date);

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
            <Comments username={username} spotUsername={spot.user} make={spot.make} model={spot.model} spotKey={spot.key} />
        </div>
    </div>
};
  
const DiscoverClient: React.FC<{ username: string }> = ({ username }) =>  {
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
                        username={username}
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