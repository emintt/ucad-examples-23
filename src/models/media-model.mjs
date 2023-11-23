import { promisePool } from "../../utils/database.mjs";

const fetchAllMedia = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM mediaItems');
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const fetchMediaById = async(id) => {
	// ? den tu thu vien mysql2, ks: Using Prepared Statements
	try {
		const sql = `SELECT media_id, MediaItems.user_id, filename, filesize, media_type, description, 
		MediaItems.created_at, user_level_id
		FROM mediaItems JOIN Users 
		ON MediaItems.user_id = Users.user_id WHERE media_id =?`;
		const params = [id]
    const [rows] = await promisePool.query(sql, params);
    console.log('rows', rows);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
}

/**
 * Add new media item to database
 * @param {object} media - object containing all info about the new media item 
 * @returns {object} - object containing 
 */

const addMedia = async (media) => {
	// oletus että media:lla on nää kaikki 
  const {user_id, filename, size, mimetype, title, description} = media;
  const sql = `INSERT INTO mediaItems (user_id, filename, filesize, media_type, title, description)
               VALUES (?, ?, ?, ?, ?, ?)`;
	// laittaa järjestyksessä (? ? ? ?...)
  const params = [user_id, filename, size, mimetype, title, description];
  try {
    const rows = await promisePool.query(sql, params);
    console.log('rows', rows);
    return {media_id: rows[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};


const deleteMediaItemById = async (id) => {
  try {
    const sql = `DELETE FROM MediaItems WHERE media_id = ?; `;
    const params = id;
    const [rows] = await promisePool.query(sql, params);
    console.log('rows',rows);
    return rows.affectedRows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
}

export { fetchAllMedia, fetchMediaById, deleteMediaItemById};