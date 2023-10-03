const express = require("express");
const app = express();
const mysql = require("mysql2");

require("dotenv").config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(express.json());

//サーバーを開始する
app.listen(3000, "localhost", () => {
  console.log("todoapp listening at http://localhost:3000");
});

//トップページのルーティング
app.get("/todos", (req, res) => {
  const sql = "SELECT * FROM todos";

  connection.query(sql, (err, results) => {
    return res.json(results);
  });
});

app.get("/todo/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM todos WHERE id = ?";

  connection.query(sql, [id], (err, results) => {
    return res.json(results);
  });
});

//jsonからtitle,detailを取得し、todosテーブルに追加する
app.post("/todo", (req, res) => {
  const title = req.body.title;
  const detail = req.body.detail;
  const is_complete = req.body.is_complete;
  const sql = "INSERT INTO todos(title, detail,is_complete) VALUES(?, ?, ?)";

  connection.query(sql, [title, detail, is_complete], (err, results) => {
    return res.json(results);
  });
});

//jsonからtitle,detail,is_completeを取得し、todosテーブルを更新する
app.put("/todo/:id", (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const detail = req.body.detail;
  const is_complete = req.body.is_complete;
  const sql =
    "UPDATE todos SET title = ?, detail = ?, is_complete = ? WHERE id = ?";

  connection.query(sql, [title, detail, is_complete, id], (err, results) => {
    return res.json(results);
  });
});

//タスク完了処理でis_completeを1にする
app.put("/todo/complete/:id", (req, res) => {
  const id = req.params.id;
  const is_complete = 1;
  const sql = "UPDATE todos SET is_complete = ? WHERE id = ?";

  connection.query(sql, [is_complete, id], (err, results) => {
    return res.json(results);
  });
});

//deleteメソッドを使って、idを取得し、todosテーブルから削除する
app.delete("/todo/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM todos WHERE id = ?";

  connection.query(sql, [id], (err, results) => {
    return res.json(results);
  });
});
