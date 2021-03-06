import { normalize } from 'normalizr';
import { mergeDeepLeft, clone, reject, equals } from 'ramda';
import {
  ADD_PLAYLIST_TO_FINAL,
  ADD_PLAYLIST_TRACK_TO_FINAL,
  REMOVE_PLAYLIST_FROM_FINAL,
  REMOVE_PLAYLIST_TRACK_FROM_FINAL,
  SET_OPEN_STATUS_FINAL_PLAYLISTS,
  SET_FINAL_PLAYLIST_OPEN,
  SET_FINAL_SEARCH_TERM,
  SET_MERGER_STATUS,
  CLEAR_FINAL_DATA,
  SET_NEW_PLAYLIST_NAME,
  SET_NEW_PLAYLIST_DESC,
  SET_FINAL_PLAYLIST_PUBLIC,
  SET_FINAL_PLAYLIST_IMAGE_URI,
  SET_COMPONOFY_MODE,
  SET_FINAL_TRACKS_SHOW_STATUS
} from '../actions';
import { playlist as playlistSchema } from '../utils/schemas';

const DEFAULT_STATE = {
  status: false,
  statusText: '',
  shouldShowOnlyTracks: false,
  playlists: {},
  lastUpdated: 0,
  searchTerm: '',
  isVisited: false,
  playlistDesc: '',
  areAllOpen: false,
  imageUri: '',
  hasChosenNewCreate: true,
  isPublic: true
};

export const finalPlaylists = (state = DEFAULT_STATE, action) => {
  // eslint-disable-next-line no-unused-vars
  let playlists, receivedAt;

  switch (action.type) {
    case ADD_PLAYLIST_TO_FINAL:
      let playlist = clone(action.playlist);
      let playlists = clone(state.playlists);

      playlist.isOpen = false;

      let normalizedPlaylist = normalize(playlist, playlistSchema);
      playlists = mergeDeepLeft(normalizedPlaylist, playlists);

      return Object.assign({}, state, {
        lastUpdated: action.receivedAt,
        playlists
      });
    case ADD_PLAYLIST_TRACK_TO_FINAL:
      receivedAt = action.receivedAt;
      playlist = clone(action.playlist);
      playlists = clone(state.playlists);
      let trackToAdd = clone(action.track);

      playlist.isOpen = false;

      if (playlists.entities && playlists.entities.playlists[playlist.id]) {
        playlist = playlists.entities.playlists[playlist.id];
        playlist.tracks.list.push(trackToAdd.id);
        playlists.entities.tracks[trackToAdd.id] = trackToAdd;
      } else {
        playlist.tracks.list = playlist.tracks.list.filter(
          track => track.id === trackToAdd.id
        );
        normalizedPlaylist = normalize(playlist, playlistSchema);
        playlists = mergeDeepLeft(state.playlists, normalizedPlaylist);
      }

      return Object.assign({}, state, {
        lastUpdated: receivedAt,
        playlists
      });
    case REMOVE_PLAYLIST_FROM_FINAL:
      receivedAt = action.receivedAt;
      let statePlaylists = clone(state.playlists);
      playlists = statePlaylists.entities.playlists;

      delete playlists[action.playlist.id];

      return Object.assign({}, state, {
        playlists: statePlaylists,
        lastUpdated: receivedAt
      });
    case REMOVE_PLAYLIST_TRACK_FROM_FINAL:
      receivedAt = action.receivedAt;
      statePlaylists = clone(state.playlists);
      playlists = statePlaylists.entities.playlists;
      let playlistTracklist = playlists[action.playlist.id].tracks.list;

      playlistTracklist = reject(equals(action.track.id), playlistTracklist);

      playlists[action.playlist.id].tracks.list = playlistTracklist;

      return Object.assign({}, state, {
        lastUpdated: receivedAt,
        playlists: statePlaylists
      });
    case SET_FINAL_PLAYLIST_OPEN:
      playlists = clone(state.playlists);
      let { playlistID, isOpen } = action;

      playlists.entities.playlists[playlistID].isOpen = isOpen;

      return Object.assign({}, state, {
        playlists
      });
    case SET_FINAL_SEARCH_TERM:
      return Object.assign({}, state, {
        searchTerm: action.searchTerm
      });
    case SET_OPEN_STATUS_FINAL_PLAYLISTS:
      playlists = clone(state.playlists);
      let playlistMap = playlists.entities.playlists;

      for (let playlistId in playlistMap) {
        playlistMap[playlistId].isOpen = action.isOpen;
      }

      return Object.assign({}, state, {
        areAllOpen: action.isOpen,
        playlists
      });
    case SET_MERGER_STATUS:
      return Object.assign({}, state, {
        status: action.status,
        statusText: action.statusText
      });
    case SET_NEW_PLAYLIST_DESC:
      return Object.assign({}, state, {
        playlistDesc: action.playlistDesc
      });
    case SET_FINAL_PLAYLIST_PUBLIC:
      return Object.assign({}, state, {
        isPublic: action.isPublic
      });
    case SET_FINAL_PLAYLIST_IMAGE_URI:
      return Object.assign({}, state, { imageUri: action.imageUri });
    case CLEAR_FINAL_DATA:
      playlists = clone(state.playlists);

      return Object.assign({}, state, DEFAULT_STATE);
    case SET_COMPONOFY_MODE:
      return Object.assign({}, state, {
        hasChosenNewCreate: action.hasChosenNewCreate
      });
    case SET_FINAL_TRACKS_SHOW_STATUS:
      return Object.assign({}, state, {
        shouldShowOnlyTracks: action.shouldShowOnlyTracks
      });
    default:
      return state;
  }
};
