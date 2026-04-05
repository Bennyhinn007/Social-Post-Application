import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Pagination,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";

const Feed = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showError = useCallback((message) => {
    setSnackbar({ open: true, message, severity: "error" });
  }, []);

  const fetchFeed = useCallback(
    async (targetPage = page) => {
      setLoadingFeed(true);
      try {
        const response = await api.get(
          `/posts/feed?page=${targetPage}&limit=${limit}`,
        );
        setPosts(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (apiError) {
        showError(apiError?.response?.data?.message || "Unable to fetch feed.");
      } finally {
        setLoadingFeed(false);
      }
    },
    [page, limit, showError],
  );

  useEffect(() => {
    fetchFeed(page);
  }, [fetchFeed, page]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handlePostCreated = async () => {
    setPage(1);
    await fetchFeed(1);
    setSnackbar({
      open: true,
      message: "Post created successfully.",
      severity: "success",
    });
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setSnackbar({
        open: true,
        message: "Post deleted.",
        severity: "success",
      });
    } catch (apiError) {
      showError(apiError?.response?.data?.message || "Failed to delete post.");
    }
  };

  const handleToggleLike = async (postId) => {
    let previousPost;

    setPosts((prev) =>
      prev.map((post) => {
        if (post._id !== postId) {
          return post;
        }

        previousPost = post;
        const alreadyLiked = post.likes.some(
          (like) => String(like.userId) === String(user?._id),
        );

        const nextLikes = alreadyLiked
          ? post.likes.filter(
              (like) => String(like.userId) !== String(user?._id),
            )
          : [...post.likes, { userId: user?._id, username: user?.username }];

        return { ...post, likes: nextLikes };
      }),
    );

    try {
      await api.put(`/posts/${postId}/like`);
    } catch (apiError) {
      if (previousPost) {
        setPosts((prev) =>
          prev.map((post) => (post._id === postId ? previousPost : post)),
        );
      }
      showError(apiError?.response?.data?.message || "Failed to update like.");
    }
  };

  const handleAddComment = async (postId, optimisticComment, commentText) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post, comments: [...post.comments, optimisticComment] }
          : post,
      ),
    );

    try {
      const response = await api.post(`/posts/${postId}/comment`, {
        text: commentText,
      });
      const savedComment = response.data.comment;

      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) {
            return post;
          }

          const nextComments = [...post.comments];
          const optimisticIndex = nextComments.findIndex(
            (comment) =>
              comment.text === optimisticComment.text &&
              String(comment.userId) === String(optimisticComment.userId),
          );

          if (optimisticIndex > -1) {
            nextComments[optimisticIndex] = savedComment;
          }

          return { ...post, comments: nextComments };
        }),
      );
    } catch (apiError) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) {
            return post;
          }

          const nextComments = post.comments.filter(
            (comment) =>
              !(
                comment.text === optimisticComment.text &&
                String(comment.userId) === String(optimisticComment.userId)
              ),
          );

          return { ...post, comments: nextComments };
        }),
      );

      showError(apiError?.response?.data?.message || "Failed to add comment.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7fbfc 0%, #f2f6f9 100%)",
      }}
    >
      <Navbar
        user={user}
        onCreatePost={() => setModalOpen(true)}
        onLogout={handleLogout}
      />

      <Container maxWidth="md" sx={{ py: 4 }}>
        {loadingFeed ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
            <CircularProgress />
          </Stack>
        ) : posts.length === 0 ? (
          <Alert severity="info">
            No posts yet. Be the first to share something.
          </Alert>
        ) : (
          <Stack spacing={3}>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onToggleLike={handleToggleLike}
                onDeletePost={handleDeletePost}
                onAddComment={handleAddComment}
              />
            ))}
          </Stack>
        )}

        <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
          <Pagination
            count={Math.max(totalPages, 1)}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            shape="rounded"
          />
        </Stack>

        <CreatePostModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={handlePostCreated}
          onError={showError}
        />
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          <Typography>{snackbar.message}</Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Feed;
