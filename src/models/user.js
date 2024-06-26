const db = require("../config/db");
const models = {};

// Check Email or Username has been used
models.checkEmail = ({ email, username }) => {
  return db.query(
    `SELECT email, username
     FROM users 
     WHERE email = $1 or username = $2`,
    [email, username]
  );
};

// Create User
models.createUser = ({ email, username, password, pin }) => {
  return db.query(
    `INSERT INTO users (email, username, password, pin)
     VALUES($1, $2, $3, $4)`,
    [email, username, password, pin]
  );
};

// Login
models.getPassByEmail = (email) => {
  return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

//Update Profile
models.updateData = ({ username, name, email, phone_number, id }) => {
  return db.query(
    `UPDATE users 
     SET 
      username = COALESCE(NULLIF($1, ''), username), 
      name = COALESCE(NULLIF($2, ''), name), 
      email = COALESCE(NULLIF($3, ''), email), 
      phone_number = COALESCE(NULLIF($4, ''), phone_number), 
      updated_at = NOW() 
     WHERE id = $5`,
    [username, name, email, phone_number, id]
  );
};

// Update Password
models.updatePass = ({ newpassword, email }) => {
  return db.query(
    `UPDATE users 
     SET 
      password = COALESCE(NULLIF($1, ''), password), 
      updated_at = NOW() 
     WHERE email = $2 
     RETURNING password`,
    [newpassword, email]
  );
};

// Update Pin
models.updatePin = ({ pin, email }) => {
  return db.query(
    `UPDATE users 
     SET 
      pin = COALESCE(NULLIF($1, ''), pin), 
      updated_at = NOW() 
     WHERE email = $2 
     RETURNING pin`,
    [pin, email]
  );
};

// Update Photo Profile
models.updatePhotoProfile = (image, email) => {
  return db.query(
    `UPDATE users SET
      photo_profile = $1,
      updated_at = now()
     WHERE email = $2
     RETURNING *`,
    [image, email]
  );
};

// Get All Receivers
models.fetchAllReceivers = (id) => {
  return db.query(
    `SELECT * FROM receivers r
     JOIN users u ON r.receiver_id = u.id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC
     LIMIT 4`,
    [id]
  );
};

// Get User
models.fetchUser = (id) => {
  return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

// Search Receivers
models.searchReceivers = (name) => {
  const search = `%${name}%`;
  return db.query(
    `SELECT * FROM receivers r
     JOIN users u ON r.receiver_id = u.id
     WHERE u.name ILIKE $1
     ORDER BY r.created_at DESC
     LIMIT 4`,
    [search]
  );
};

// Add Receiver
models.addReceiver = ({ user_id, phone_number }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users
       WHERE phone_number = $1`,
      [phone_number]
    )
      .then(({ rows }) => {
        if (rows.length === 0) {
          throw Error("Receiver not found!");
        } else if (rows[0].id === user_id) {
          throw Error("Receiver must be someone else!");
        } else {
          resolve(
            db.query(
              `INSERT INTO receivers (user_id, receiver_id)
               VALUES ($1, $2)`,
              [user_id, rows[0].id]
            )
          );
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Delete Receiver
models.deleteReceiver = (id) => {
  return db.query(`DELETE FROM receivers WHERE receiver_id = $1`, [id]);
};

module.exports = models;
