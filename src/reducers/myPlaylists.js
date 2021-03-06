import * as R from 'ramda';
import {
  REQUEST_PLAYLISTS,
  RECEIVE_PLAYLISTS,
  SET_PLAYLIST_OPEN,
  SET_MY_PLAYLIST_VISITED,
  REQUEST_PLAYLIST_TRACKS,
  RECEIVED_PLAYLIST_TRACKS,
  SET_OPEN_STATUS_MY_PLAYLISTS,
  SET_MY_SEARCH_TERM,
  CLEAR_MY_DATA,
  REORDER_PLAYLIST_TRACKS,
  SET_PLAYLIST_DRAG_STATUS,
  REQUEST_MY_TOP_TRACKS,
  RECEIVED_MY_TOP_TRACKS
} from '../actions';
import { removeDuplicates } from '../utils/helpers';
import {
  OFFSET_LIMIT,
  SUGGESTED_PLAYLIST_PLACEHOLDER
} from '../utils/constants';

const DEFAULT_STATE = {
  tracksFetching: false,
  searchTerm: '',
  playlists: [],
  numberOfTracks: 0,
  lastUpdated: 0,
  currentOffset: 0,
  playlistsRemaining: 0,
  canLoadMore: true,
  areAllOpen: false,
  isFetching: false,
  isVisited: false,
  isFetchingMyTopTracks: false
};

export const myPlaylists = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case REQUEST_PLAYLISTS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_PLAYLISTS:
      let playlists = [...state.playlists, ...action.playlists];
      let {
        currentOffset,
        playlistsRemaining,
        numberOfTracks,
        canLoadMore
      } = state;

      numberOfTracks = action.numberOfTracks;

      if (numberOfTracks < OFFSET_LIMIT) {
        currentOffset = numberOfTracks;
      } else {
        if (playlistsRemaining < OFFSET_LIMIT && currentOffset !== 0) {
          currentOffset += playlistsRemaining;
        } else {
          currentOffset += OFFSET_LIMIT;
        }
      }

      if (currentOffset === numberOfTracks) {
        canLoadMore = false;
      }

      playlistsRemaining = numberOfTracks - currentOffset;

      return Object.assign({}, state, {
        numberOfTracks: action.numberOfTracks,
        lastUpdated: action.receivedAt,
        isFetching: false,
        playlistsRemaining,
        currentOffset,
        canLoadMore,
        playlists
      });
    case RECEIVED_PLAYLIST_TRACKS:
      const updatedPlaylists = state.playlists.map(playlist => {
        if (playlist.id === action.playlistID) {
          playlist.tracks.list = removeDuplicates(action.tracks, 'id');
        }
        return playlist;
      });

      return Object.assign({}, state, {
        playlists: updatedPlaylists,
        tracksFetching: false
      });
    case SET_PLAYLIST_OPEN:
      const { playlistID, isOpen } = action;
      let myPlaylists = Array.from(state.playlists);

      myPlaylists = myPlaylists.map(playlist => {
        if (playlist.id === playlistID) {
          playlist.isOpen = isOpen;
        }
        return playlist;
      });

      return Object.assign({}, state, {
        playlists: myPlaylists
      });
    case SET_PLAYLIST_DRAG_STATUS:
      myPlaylists = Array.from(state.playlists);

      myPlaylists = myPlaylists.map(playlist => {
        if (playlist.id === action.playlistId) {
          playlist.hasReorderRequest = action.hasReorderRequest;
        }
        return playlist;
      });

      return Object.assign({}, state, {
        playlists: myPlaylists
      });

    case SET_MY_PLAYLIST_VISITED:
      return Object.assign({}, state, {
        isVisited: action.isVisited
      });
    case REQUEST_PLAYLIST_TRACKS:
      return Object.assign({}, state, {
        tracksFetching: true
      });
    case SET_OPEN_STATUS_MY_PLAYLISTS:
      myPlaylists = Array.from(state.playlists);

      myPlaylists = myPlaylists.map(playlist => {
        playlist.isOpen = action.isOpen;
        return playlist;
      });

      return Object.assign({}, state, {
        areAllOpen: action.isOpen,
        playlists: myPlaylists
      });
    case SET_MY_SEARCH_TERM:
      return Object.assign({}, state, { searchTerm: action.searchTerm });
    case REORDER_PLAYLIST_TRACKS:
      const { playlistId, startPosition, endPosition } = action;
      playlists = Array.from(state.playlists);

      let {
        tracks: { list: tracklist }
      } = R.find(R.propEq('id', playlistId), playlists);

      const [removed] = tracklist.splice(startPosition, 1);
      tracklist.splice(endPosition, 0, removed);

      return Object.assign({}, state, { playlists });
    case REQUEST_MY_TOP_TRACKS:
      return Object.assign({}, state, { isFetchingMyTopTracks: true });
    case RECEIVED_MY_TOP_TRACKS:
      playlists = R.clone(state.playlists);
      playlists = [
        { ...SUGGESTED_PLAYLIST_PLACEHOLDER(action.tracks) },
        ...playlists
      ];

      return Object.assign({}, state, {
        isFetchingMyTopTracks: false,
        playlists
      });
    case CLEAR_MY_DATA:
      return Object.assign({}, state, DEFAULT_STATE);
    default:
      return state;
  }
};
