const db = require("../config/db");

const model = {
  transfer: (idToken, receiver, amount, notes) => {
    return new Promise((resolve, reject) => {
      db.query(
        `insert into transactions (sender_id, receiver_id, amount, notes) 
                  values($1, $2, $3, $4)`,
        [idToken, receiver, amount, notes]
      )
        .then((res) => {
          resolve(`${res.rowCount} data created`);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

// mengambil data user untuk kebutuhan login berdasarkan email

module.exports = model;
