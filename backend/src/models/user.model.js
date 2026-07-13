const db = require("../database/db");

const createUser = (user, callback) => {
  const sql = `
    INSERT INTO tbd_usuarios (nombre, email, password, token, telefono)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user.nombre, user.email, user.password, user.token, user.telefono || null],
    callback
  );
};

module.exports = { createUser };