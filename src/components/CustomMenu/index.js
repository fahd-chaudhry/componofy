import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { MenuItem, MenuList } from 'material-ui/Menu';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import tealColor from 'material-ui/colors/teal';
import { Manager, Target, Popper } from 'react-popper';
import classNames from 'classnames';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';

const styles = {
    popperClose: {
        pointerEvents: 'none'
    },

    settingsButton: {},

    buttonTarget: {
        float: 'right'
    },

    grow: {
        left: '-3px'
    }
};

const CustomMenu = props => {
    const IconComponent = props.iconComponent;

    return (
        <Manager>
            <Target className={props.classes.buttonTarget}>
                <Button
                    aria-owns={props.isOpen ? 'menu-list' : null}
                    color="primary"
                    className={props.classes.settingsButton}
                    aria-haspopup="true"
                    onClick={props.onClickOptions}
                    fab
                >
                    <IconComponent />
                </Button>
            </Target>
            <Popper
                eventsEnabled={props.isOpen}
                className={props.classes.grow}
                className={classNames({
                    [props.classes.popperClose]: !props.isOpen
                })}
                placement="top-start"
            >
                <ClickAwayListener onClickAway={props.onSelectItem}>
                    <Grow
                        in={props.isOpen}
                        id="menu-list"
                        style={{ transformOrigin: '0 0 0' }}
                    >
                        <Paper>
                            <MenuList role="menu">
                                <MenuItem
                                    disabled={!props.canScrollUp}
                                    onClick={props.onClickUp}
                                >
                                    Up
                                </MenuItem>
                                <MenuItem onClick={props.onClickCollapse}>
                                    Collapse
                                </MenuItem>
                            </MenuList>
                        </Paper>
                    </Grow>
                </ClickAwayListener>
            </Popper>
        </Manager>
    );
};

CustomMenu.propTypes = {
    onClickCollapse: PropTypes.func.isRequired,
    iconComponent: PropTypes.func.isRequired,
    onClickOptions: PropTypes.func.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    onClickUp: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    onClickUp: PropTypes.func.isRequired,
    anchorEl: PropTypes.object,
    isOpen: PropTypes.bool.isRequired
};

export default withStyles(styles)(CustomMenu);