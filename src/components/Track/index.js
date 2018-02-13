import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import { head } from 'ramda';
import { TRACK_PROPTYPE, PLAYLIST_PROPTYPE } from '../../utils/constants';
import { CheckBox } from '../common';
import Info from './Info';
import Preview from './Preview';

const styles = theme => ({
    trackInfoContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    trackInfo: {
        flex: '1'
    },

    preview: {
        flex: '1'
    },

    mediaPlayer: {
        display: 'none'
    }
});

class Track extends PureComponent {
    static propTypes = {
        removePlaylistTrackFromFinal: PropTypes.func.isRequired,
        playlistContainsThisTrack: PropTypes.bool.isRequired,
        addPlaylistTrackToFinal: PropTypes.func.isRequired,
        track: TRACK_PROPTYPE.isRequired,
        playlist: PLAYLIST_PROPTYPE
    };

    _handleChecked = event => {
        const {
            track,
            playlist,
            addPlaylistTrackToFinal,
            removePlaylistTrackFromFinal,
            playlistContainsThisTrack
        } = this.props;

        if (playlist) {
            if (playlistContainsThisTrack) {
                removePlaylistTrackFromFinal(track, playlist);
            } else {
                addPlaylistTrackToFinal(track, playlist);
            }
        }
    };

    render() {
        const { track, classes, playlistContainsThisTrack } = this.props;
        const {
            artists,
            name: trackName,
            album: { name: albumName, external_urls: { spotify: albumUrl } },
            external_urls: { spotify: trackUrl },
            preview_url,
            popularity
        } = track;
        const {
            name: artistName,
            external_urls: { spotify: artistUrl }
        } = head(artists);
        let previewComponent;

        const isPopular = popularity >= 70;

        if (preview_url) {
            previewComponent = (
                <div className={classes.preview}>
                    <Preview url={preview_url} />
                </div>
            );
        }

        return (
            <ListItem divider>
                <ListItemIcon>
                    <CheckBox
                        onClick={this._handleChecked}
                        checked={playlistContainsThisTrack}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={
                        <div className={classes.trackInfoContainer}>
                            <div className={classes.trackInfo}>
                                <Info
                                    trackName={trackName}
                                    trackUrl={trackUrl}
                                    artistName={artistName}
                                    artistUrl={artistUrl}
                                    albumName={albumName}
                                    albumUrl={albumUrl}
                                    isPopular={isPopular}
                                />
                            </div>
                            {previewComponent}
                        </div>
                    }
                />
            </ListItem>
        );
    }
}

export default withStyles(styles)(Track);
