import mysql from "mysql2/promise";

// Update these values with your local MySQL credentials
const pool = mysql.createPool({
  host: "localhost",
  user: "keepituser", // your MySQL user
  password: "nrq8fay*P3@faPMsfs@PjeN43WcEYqo!UqBjup8n.4NYiCoCc7_oX.MQAT", // your MySQL password
  database: "keep_it_going", // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
