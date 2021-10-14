/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlistsong', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  //Add constraint UNIQUE for avoid duplication of data between the two values
  pgm.addConstraint('playlistsong', 'unique_playlist_id_song_id', 'UNIQUE(playlist_id, song_id)');

  //Add FK on column playlist_id and song_id to playlists.id and sons.id
  pgm.addConstraint('playlistsong', 'FK_playlistsong.playlist_id.playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id)');
  pgm.addConstraint('playlistsong', 'FK_playlistsong.song_id.songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id)');
};

exports.down = (pgm) => {
  pgm.dropTable('playlistsong');
};
