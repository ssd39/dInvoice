import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import "./Menubar.css";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import LoopIcon from "@mui/icons-material/Loop";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  borderTopLeftRadius: "1.5rem",
  flexShrink: 0,
  height: "100%",
  whiteSpace: "nowrap",
  "& .MuiPaper-root ": {
    position: "revert",
  },
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
export default function Menubar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [selIndex, setSelIndex] = useState(0);
  const location = useLocation()

  const routeDataMap = {
    "/app/overview": 0,
    "/app/inward-invoices": 1,
    "/app/outward-invoices": 2,
    "/app/payroll": 3,
    "/app/settings": 4
  }
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log(location.pathname)
    if(location.pathname=="/app" || location.pathname=="/app/"){
      navigate("/app/overview")
    }else{
      setSelIndex(routeDataMap[location.pathname])
    }
  
  }, [location.pathname])

  return (
    <>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {open ? (
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {[
            {
              text: "Overview",
              icon: <AnalyticsIcon />,
              path: "/app/overview",
            },

            {
              text: "Inward Invoices",
              icon: <CallReceivedIcon />,
              path: "/app/inward-invoices",
            },
            {
              text: "Outward Invoices",
              icon: <CallMadeIcon />,
              path: "/app/outward-invoices",
            },
            {
              text: "Payroll",
              icon: <LoopIcon />,
              path: "/app/payroll",
            },
            {
              text: "Settings",
              icon: <SettingsIcon />,
              path: "/app/settings",
            },
          ].map((item, index) => (
            <ListItem
              onClick={() => {
                setSelIndex(index);
                navigate(item.path);
              }}
              key={item.text}
              disablePadding
              sx={{ display: "block" }}
            >
              <Tooltip   placement={'right'}  title={item.text}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  className={selIndex == index ? "selected-menu-item" : ""}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: selIndex == index ? "white" : "",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    className={selIndex == index ? "text-white " : ""}
                    primary={item.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
