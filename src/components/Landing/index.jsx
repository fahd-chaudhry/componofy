import React, { Component } from 'react';
import { cyan500 } from 'material-ui/colors';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import './Landing.css';

const styles = theme => ({
    root: {
        margin: 0,
        width: '100%',
        padding: '3.5em',
        textAlign: 'center'
    },

    authBtn: {
        marginTop: '25px'
    },

    icon: {
        color: '#7fc37f',
        fontSize: '2em',
        marginRight: '5px'
    },

    iconText: {}
});

class Landing extends Component {
    props: {
        onAuth: Function,
        children: Object,
        icon: String,
        title: String,
        subTitle: String,
        iconText: String,
        width: Number,
        classes: mixed
    };

    _handleAuthentication = (event: SyntheticInputEvent) => {
        const { onAuth } = this.props;

        if (onAuth) {
            onAuth();
        }
    };

    render() {
        const classes = this.props.classes;

        return (
            <Paper elevation={8} style={{ width: this.props.width }}>
                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <Typography type="display3" color="accent" component="h1">
                            {this.props.title}
                        </Typography>
                        <Typography className="sub-header" type="body1" color="secondary" component="p">
                            {this.props.subTitle}
                        </Typography>
                        <Divider default className="subhead-div-hr" />
                    </Grid>
                    <Grid item xs={12} className={classes.authBtn}>
                        <Button onClick={this._handleAuthentication} raised color="primary">
                            <span className={classes.icon}>
                                {this.props.children}
                            </span>
                            <Typography type="button" className={classes.iconText}>
                                {this.props.iconText}
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(Landing);
