/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const mapDBToPlaylist = ({
  id,
  name,
  username,
}) => ({
  id, name, username,
});

export {
  mapDBToModel,
  mapDBToPlaylist,
};
