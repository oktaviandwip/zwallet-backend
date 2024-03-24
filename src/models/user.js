const db = require("../config/db");
const model = {};

// mengambil data user untuk kebutuhan login berdasarkan email
model.getPassByEmail = (email) => {
  console.log(email);
  return new Promise((resolve, reject) => {
    db.query(`SELECT id, password FROM users WHERE email = $1`, [email])
      .then((res) => {
        if (res.rows.length) {
          resolve(res.rows[0]);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Cek data apakah ada atau tidak didalam table user with id user
// Sekarang hanya mengambil id dan img (jika membutuhkan colom lain tambahkan saja)
model.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT id, image FROM users WHERE id = $1`, [id])
      .then((res) => {
        let result = res.rows;
        if (result <= 0) {
          result = false;
        }
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

model.updateImageUser = (image, id_user) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE users SET
                image = $1,
                updated_at = now()
            WHERE id = $2`,
      [image, id_user]
    )
      .then((res) => {
        resolve(`${res.rowCount} user updated`);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = model;
