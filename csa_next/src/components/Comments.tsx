import { add_comment, delete_comment, get_comments, like_comment } from "@/api/cars";
import { getTimeAgo } from "@/functions/functions";
import { useState } from "react";
import Button from "./Button";
import Image from "next/image";
import down_arrow from "@/images/down_arrow.svg";

interface NestedComment {
    key: string;
    commentId: string;
    parentId?: string;
    comment: string;
    date: string;
    user: string;
    likes: string;
    liked: string;
    children?: NestedComment[];
    deleted?: string;
}

const Comments: React.FC<{
    username: string, 
    spotUsername: string, 
    make: string, 
    model: string, 
    spotKey: string,
    isAdmin: boolean
}> = ({ 
    username, 
    spotUsername, 
    make, 
    model, 
    spotKey,
    isAdmin
}) => {
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

    function CommentItem({
        comment,
        username,
    }: {
        comment: NestedComment;
        username: string;
    }) {
        const timeAgo = getTimeAgo(comment.date);
      
        const [liked, setLiked] = useState(comment.liked == "true");
        const [likeCount, setLikeCount] = useState(parseInt(comment.likes) || 0);
      
        const onLike = () => {
            const prevLiked = liked;
            const prevLikeCount = likeCount;
        
            setLiked(!liked);
            setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        
            like_comment(comment.key, comment.commentId).catch((error) => {
                setLiked(prevLiked);
                setLikeCount(prevLikeCount);
                console.error("Error liking comment:", error);
            });
        };
      
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
                <p className="break-words">{comment.comment}</p>
                {comment.deleted != "true" && (
                <div className="flex gap-2">
                    <p className="p-1 text-xl text-nowrap">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</p>
                    <Button text={liked ? 'Remove like' : 'Like'} onClick={onLike} />
                    <Button text="Reply" onClick={() => onComment(comment.commentId)} />
                    {isAdmin || username === comment.user && <Button text="Delete" onClick={() => {
                        delete_comment(spotUsername, make, model, spotKey, comment.commentId).then(() => {
                            getComments();
                        });
                    }} />}
                </div>
                )}
                {comment.children &&
                    comment.children.map((child) => (
                        <CommentItem key={child.commentId} comment={child} username={username} />
                    ))
                }
            </div>
        );
    }

    const onComment = (parent?: string) => {
        if (!newComment) return;

        add_comment(spotUsername, make, model, spotKey, newComment, parent).then(() => {
            getComments();
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
        <div className='w-full max-w-96 overflow-hidden'>
            <div 
                className='flex gap-2 cursor-pointer m-1'
                onClick={() => {
                    if (!open) getComments();    
                    setOpen(!open)
                }}
            >
                <p className='text-xl'>Comments</p>
                <Image src={down_arrow} alt="Down arrow" width={15} height={15} className={open ? "transform rotate-180" : ""} />
            </div>
            {open && <div className='bg-white p-1 w-full'>
                <div className='flex gap-2'>
                <textarea 
                    className='w-full p-1 border border-black rounded' 
                    value={newComment} 
                    onChange={e => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                        setNewComment(e.target.value);
                    }} 
                    placeholder='Write a comment...'
                />
                <Button text='Comment' className="h-min" onClick={() => onComment()} />
                </div>
                <div className="my-2">
                    {Array.isArray(comments) && comments.length > 0 ? (
                        buildCommentTree(comments).map((comment) => (
                            <CommentItem key={comment.commentId} comment={comment} username={username} />
                        ))
                    ) : (
                        <p className="text-center ">No comments. Be the first to comment!</p>
                    )}
                </div>
            </div>}
        </div>
    );
}

export default Comments;