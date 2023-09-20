import Link from "next/link";
import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import {
  AppBar,
  Toolbar,
  Tooltip,
  Typography,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Divider,
  Badge,
  MailIcon,
  AccountCircle,
  Avatar,
  Menu,
  MenuItem,
  Settings,
  Logout,
} from "@mui/material";

import { PAGES } from "../constants";

const AppHeader: React.FC<AppHeaderProps> = (props) => {
  const {
    authenticated,
    currentUser,
    handleRightMenu,
    handleLeftMenu,
    onLogout,
    handleLoading,
    children,
  } = props;

  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar elevation={2} sx={{ width: 1 / 1, position: "relative" }}>
      <Toolbar>
        {children}

        <Tooltip title={t("homepage")}>
          <Typography
            component="h1"
            sx={{ fontSize: 20, display: { xs: "none", sm: "block" } }}
          >
            <Link href="/">knowledgeBase</Link>
          </Typography>
        </Tooltip>

        <Tooltip
          title={t("homepage")}
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          <Typography
            component="h1"
            sx={{ fontSize: 17, display: { xs: "block", sm: "none" } }}
          >
            <Link href="/">knowbase</Link>
          </Typography>
        </Tooltip>

        <Box sx={{ flexGrow: 1 }} />

        {authenticated ? (
          <Box sx={{ display: { md: "flex" } }}>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {PAGES.map((page) => (
                <Link href={page.link} key={page.name} passHref>
                  <Button
                    sx={{
                      color: "#FFF",
                      display: "flex",
                      py: 1,
                      px: 1.5,
                      my: 0.6,
                    }}
                    onClick={() => {
                      handleLoading(true);
                    }}
                  >
                    {t(page.name)}
                  </Button>
                </Link>
              ))}
            </Box>

            <Tooltip title={t("messages")}>
              <IconButton
                size="large"
                aria-label="show 3 new mails"
                color="inherit"
                sx={{
                  my: 0.7,
                  mx: 0.4,
                  p: { xl: 1.3, lg: 1.2, md: 1.1, sm: 1, xs: 0.9 },
                }}
                onClick={() => handleRightMenu("messages")}
              >
                <Badge
                  badgeContent={currentUser?.messages?.length ?? 0}
                  color="error"
                >
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title={t("account-settings")}>
              <IconButton
                onClick={handleClick}
                size="large"
                sx={{
                  my: 0.7,
                  mx: 0.5,
                  p: { xl: 1, lg: 1, md: 0.9, sm: 1, xs: 0.8 },
                }}
              >
                {!!currentUser?.avatarUrl ? (
                  <Avatar
                    alt={""}
                    src={currentUser.avatarUrl}
                    sx={{
                      width: { xl: 30, lg: 30, md: 30, sm: 28, xs: 26 },
                      height: { xl: 30, lg: 30, md: 30, sm: 28, xs: 26 },
                    }}
                  />
                ) : (
                  <AccountCircle
                    sx={{
                      width: { xl: 30, lg: 30, md: 30, sm: 28, xs: 26 },
                      height: { xl: 30, lg: 30, md: 30, sm: 38, xs: 26 },
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box sx={{ display: "flex" }}>
            <Link href="/login" passHref>
              <Button
                key={"login"}
                sx={{
                  color: "#FFF",
                  display: "flex",
                  py: 1,
                  px: 1.5,
                  my: 0,
                  mx: 0.5,
                }}
                onClick={() => {}}
              >
                {t("login")}
              </Button>
            </Link>

            <Link href="/signup" passHref>
              <Button
                key={"signup"}
                sx={{
                  color: "#FFF",
                  display: "flex",
                  py: 1,
                  px: 1.5,
                  my: 0,
                  mx: 0.5,
                }}
                onClick={() => {}}
                variant={"contained"}
              >
                {t("signup")}
              </Button>
            </Link>
          </Box>
        )}

        {currentUser && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                bgcolor: "#121212 !important",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Link href={"/" + currentUser.username} passHref>
              <MenuItem
                key={"profile"}
                component="a"
                sx={{
                  color: "#FFF",
                  display: "flex",
                  py: 1,
                  px: 1.5,
                  my: 0,
                  mx: 0.5,
                }}
                onClick={() => {}}
              >
                <Avatar /> {t("profile")}
              </MenuItem>
            </Link>
            <Link href={"/profile"} passHref>
              <MenuItem
                key={"my-account"}
                component="a"
                sx={{
                  color: "#FFF",
                  display: "flex",
                  py: 1,
                  px: 1.5,
                  my: 0,
                  mx: 0.5,
                }}
                onClick={() => {}}
                disabled
              >
                <Avatar /> {t("my-account")}
              </MenuItem>
            </Link>
            <Divider />

            <MenuItem onClick={() => handleRightMenu("settings")}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              {t("settings")}
            </MenuItem>

            <MenuItem onClick={onLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              {t("logout")}
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
