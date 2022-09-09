import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Drawer,
} from '@material-ui/core';
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
    marginTop: '80px',
    width: theme.spacing(20),
    height: theme.spacing(30),
  },
  listItem: {
    color: 'white',
  },
}));

const listItems = [
  {
    listIcon: <ChevronRightIcon />,
    listText: 'Početna stranica',
    link: '/',
  },
  {
    listIcon: <ChevronRightIcon />,
    listText: 'Iterativni algoritam',
    link: '/bruteforce',
  },
  {
    listIcon: <ChevronRightIcon />,
    listText: 'Prefiksna stabla',
    link: '/patternprefixtrie',
  },
  {
    listIcon: <ChevronRightIcon />,
    listText: 'Sufiksna stabla',
    link: '/suffixtrie',
  },
  {
    listIcon: <ChevronRightIcon />,
    listText: 'Kompresovana sufiksna stabla',
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
          >
            <ListItemIcon className={classes.listItem}>{listItem.listIcon}</ListItemIcon>
            <ListItemText primary={listItem.listText} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav">
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        {sideList()}
      </Drawer>
    </Box>
  );
}
