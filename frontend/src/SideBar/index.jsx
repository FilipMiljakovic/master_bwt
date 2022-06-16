import React, { useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Drawer,
} from '@material-ui/core';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const useStyles = makeStyles((theme) => ({
  menuSliderContainer: {
    width: 300,
    background: '#081054',
    height: '100%',
  },
  avatar: {
    margin: '0.5rem auto',
    padding: '1rem',
    width: theme.spacing(20),
    height: theme.spacing(30),
  },
  listItem: {
    color: '#00FFFF',
  },
}));

const listItems = [
  {
    listIcon: <ChevronRightIcon />,
    listText: 'Home',
    link: '/',
  },
  {
    listIcon: <ChevronRightIcon />,
    listText: 'Brute force',
    link: '/bruteforce',
  },
  {
    listIcon: <ChevronRightIcon />,
    listText: 'Pattern prefix trie',
    link: '/patternprefixtrie',
  },
  {
    listIcon: <ChevronRightIcon />,
    listText: 'Suffix trie',
    link: '/suffixtrie',
  },
  {
    listIcon: <ChevronRightIcon />,
    listText: 'Compressed suffix trie',
    link: '/suffixtriecompressed',
  },
  {
    listIcon: <ChevronRightIcon />,
    listText: 'BWT',
    link: '/bwt',
  },
];

export default function SideBar() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggleSlider = () => {
    setOpen(!open);
  };

  const sideList = () => (
    <Box className={classes.menuSliderContainer} component="div">
      <Avatar className={classes.avatar} src="/DNA.png" alt="DNA" />
      <Divider />
      <List>
        {listItems.map((listItem, index) => (
          <ListItem
            className={classes.listItem}
            button
            key={index}
            component={Link}
            to={listItem.link}
            onClick={toggleSlider}
          >
            <ListItemIcon className={classes.listItem}>{listItem.listIcon}</ListItemIcon>
            <ListItemText primary={listItem.listText} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box component="nav">
        <AppBar position="static" style={{ background: '#191970' }}>
          <Toolbar>
            <IconButton onClick={toggleSlider}>
              <MenuIcon style={{ color: '#00FFFF' }} />
            </IconButton>
            <Drawer open={open} anchor="left" onClose={toggleSlider}>
              {sideList()}
            </Drawer>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
