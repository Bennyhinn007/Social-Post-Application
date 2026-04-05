import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api/axios";

const CreatePostModal = ({ open, onClose, onCreated, onError }) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () => text.trim().length > 0 || Boolean(imageFile),
    [text, imageFile],
  );

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return undefined;
    }

    const fileUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(fileUrl);

    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [imageFile]);

  const resetState = () => {
    setText("");
    setImageFile(null);
    setPreviewUrl("");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    if (loading) {
      return;
    }
    resetState();
    onClose();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setImageFile(selectedFile || null);
  };

  const handleSubmit = async () => {
    setError("");

    if (!canSubmit) {
      setError("A post must include text or an image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (text.trim()) {
        formData.append("text", text.trim());
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await api.post("/posts/create", formData);

      onCreated(response.data.post);
      resetState();
      onClose();
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to create post.";
      setError(message);
      if (onError) {
        onError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Post</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            multiline
            minRows={4}
            maxRows={8}
            label="What is on your mind?"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />

          <Button variant="outlined" component="label">
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {previewUrl ? (
            <Box
              component="img"
              src={previewUrl}
              alt="Preview"
              sx={{
                width: "100%",
                maxHeight: 320,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              You can post text, image, or both.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit || loading}
        >
          {loading ? "Posting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostModal;
