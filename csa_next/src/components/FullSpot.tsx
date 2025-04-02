"use client";

import { getTimeAgo } from "@/functions/functions";
import { useMemo, useState } from "react";
import { like_spot } from "@/api/cars";
import Spotimage from "./Spotimage";
import Comments from "./Comments";
import Button from "./Button";


const FullSpot: React.FC<{ 
    spot: Spot, 
    username: string, 
    isAdmin: boolean 
}> = ({ 
    spot, 
    username, 
    isAdmin 
}) => {
    const [shared, setShared] = useState(false);
    const [liked, setLiked] = useState(spot.likedByUser);
    const [likeCount, setLikeCount] = useState(spot.likes);

    const buildSpotLink = (spot: Spot) =>
        `https://spots.vest.li/makes/selected/modelselected?make=${encodeURIComponent(
            spot.make
        )}&model=${encodeURIComponent(spot.model)}&username=${encodeURIComponent(
            spot.user
        )}&key=${encodeURIComponent(spot.key)}`;
    
    const spotLink = useMemo(() => buildSpotLink(spot), [spot]);

    const timeAgo = useMemo(() => getTimeAgo(spot.uploadDate), [spot.uploadDate]);

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
    
    return <div className="bg-white w-max font-ListComponent">
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
            <Comments 
                username={username} 
                spotUsername={spot.user} 
                make={spot.make} 
                model={spot.model} 
                spotKey={spot.key} 
                isAdmin={isAdmin} 
            />
        </div>
    </div>
};

export default FullSpot;