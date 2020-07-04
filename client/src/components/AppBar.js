import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const AppBar = () => (
  <AppBar position="absolute" color="default" className={classes.appBar}>
    <Toolbar>
      <Typography variant="h6" color="inherit" noWrap>
        Company name
      </Typography>
    </Toolbar>
  </AppBar>
);

export default AppBar;
