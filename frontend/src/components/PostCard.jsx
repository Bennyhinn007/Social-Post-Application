import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CommentSection from "./CommentSection";

const getRelativeTime = (dateValue) => {
  const date = new Date(dateValue);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  const intervals = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, ms] of intervals) {
    const value = Math.round(diffMs / ms);
    if (Math.abs(value) >= 1) {
      return formatter.format(value, unit);
    }
  }

  return "just now";
};

const PostCard = ({
  post,
  currentUser,
  onToggleLike,
  onDeletePost,
  onAddComment,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const isOwner = useMemo(
    () => String(post.author.userId) === String(currentUser?._id),
    [post.author.userId, currentUser?._id],
  );

  const likedByCurrentUser = useMemo(
    () =>
      post.likes.some(
        (like) => String(like.userId) === String(currentUser?._id),
      ),
    [post.likes, currentUser?._id],
  );

  const handleAddComment = async (commentText) => {
    const optimisticComment = {
      userId: currentUser?._id,
      username: currentUser?.username,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    setCommentLoading(true);
    await onAddComment(post._id, optimisticComment, commentText);
    setCommentLoading(false);
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardHeader
        avatar={
          <Avatar>
            {post.author.username?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
        }
        title={<Typography fontWeight={700}>{post.author.username}</Typography>}
        subheader={getRelativeTime(post.createdAt)}
        action={
          isOwner ? (
            <IconButton
              onClick={() => onDeletePost(post._id)}
              aria-label="delete post"
            >
              <DeleteOutlineIcon />
            </IconButton>
          ) : null
        }
      />

      {(post.text || "").trim() ? (
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1">{post.text}</Typography>
        </CardContent>
      ) : null}

      {post.imageUrl ? (
        <Box
          component="img"
          src={post.imageUrl}
          alt="Post"
          sx={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
        />
      ) : null}

      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              onClick={() => onToggleLike(post._id)}
              aria-label="toggle like"
            >
              {likedByCurrentUser ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography variant="body2">{post.likes.length}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              onClick={() => setExpanded((prev) => !prev)}
              aria-label="toggle comments"
            >
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Typography variant="body2">{post.comments.length}</Typography>
          </Stack>
        </Stack>

        {expanded ? (
          <>
            <Divider sx={{ my: 1.5 }} />
            <CommentSection
              comments={post.comments}
              onAddComment={handleAddComment}
              loading={commentLoading}
            />
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default PostCard;
