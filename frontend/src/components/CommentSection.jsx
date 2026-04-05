import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

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

const CommentSection = ({ comments, onAddComment, loading }) => {
  const [text, setText] = useState("");

  const sortedComments = useMemo(
    () =>
      [...comments].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      ),
    [comments],
  );

  const handlePost = () => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    onAddComment(trimmedText);
    setText("");
  };

  return (
    <Box sx={{ pt: 1 }}>
      <List disablePadding>
        {sortedComments.map((comment, index) => (
          <Box key={`${comment.userId}-${comment.createdAt}-${index}`}>
            <ListItem alignItems="flex-start" disableGutters>
              <ListItemAvatar>
                <Avatar>
                  {comment.username?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={700}>{comment.username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getRelativeTime(comment.createdAt)}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ mt: 0.5 }}
                  >
                    {comment.text}
                  </Typography>
                }
              />
            </ListItem>
            {index < sortedComments.length - 1 ? (
              <Divider sx={{ my: 0.5 }} />
            ) : null}
          </Box>
        ))}
      </List>

      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Write a comment..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={!text.trim() || loading}
        >
          Post
        </Button>
      </Stack>
    </Box>
  );
};

export default CommentSection;
