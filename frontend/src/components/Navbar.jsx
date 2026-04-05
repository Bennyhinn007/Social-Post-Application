import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";

const Navbar = ({ user, onCreatePost, onLogout }) => {
  const fallbackLetter = user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          "linear-gradient(135deg, #0f4c5c 0%, #1f7a8c 45%, #4f9da6 100%)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 0.5 }}>
        <Typography variant="h5" fontWeight={800} letterSpacing={0.5}>
          SocialPulse
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={onCreatePost}
            sx={{ borderRadius: 99 }}
          >
            New Post
          </Button>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography fontWeight={600}>{user?.username}</Typography>
          </Box>

          <Avatar src={user?.avatar || ""}>{fallbackLetter}</Avatar>

          <IconButton color="inherit" onClick={onLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
