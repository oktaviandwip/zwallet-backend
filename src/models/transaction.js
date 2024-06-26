const db = require("../config/db");
const models = {};

// Transfer
models.newTransaction = async ({ sender_id, receiver_id, amount, notes }) => {
  try {
    await db.query("BEGIN");

    // Check the Available Balance
    const senderBalanceResult = await db.query(
      "SELECT balance FROM users WHERE id = $1",
      [sender_id]
    );

    const senderBalance = senderBalanceResult.rows[0].balance;
    if (senderBalance < amount) {
      throw new Error("Insufficient balance!");
    }

    // Update Balance
    const { rows } = await updateBalance(sender_id, -amount);
    await updateBalance(receiver_id, amount);

    // Insert to Transactions Table
    await db.query(
      `INSERT INTO transactions (sender_id, receiver_id, amount, notes) 
     VALUES ($1, $2, $3, $4)`,
      [sender_id, receiver_id, amount, notes]
    );
    await db.query("COMMIT");
    return rows;
  } catch (error) {
    await db.query("ROLLBACK");
    if (error.message === "Insufficient balance!") {
      return error;
    } else {
      new Error("Transaction failed!");
    }
  }
};

function updateBalance(id, amount) {
  return db.query(
    "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
    [amount, id]
  );
}

// Get Balance
models.getBalance = (id) => {
  return db.query(
    `-- Get Last 7 Days
      WITH dates AS (
        SELECT generate_series(
          current_date - interval '5 days', 
          current_date + 1, 
          interval '1 day'
        )::date AS date
      ),
      -- Create Income Table
      income AS (
        SELECT
          d.date,
          COALESCE(SUM(t.amount), 0) AS income
        FROM
          dates d
          LEFT JOIN transactions t ON t.receiver_id = $1 AND t.created_at <= d.date
        GROUP BY
          d.date
      ),
      -- Create Expense Table
      expense AS (
        SELECT
          d.date,
          COALESCE(SUM(t.amount), 0) AS expense
        FROM
          dates d
          LEFT JOIN transactions t ON t.sender_id = $1 AND t.created_at <= d.date
        GROUP BY
          d.date
      )
      -- Select Income, Expense & Balance for Last 7 Days
      SELECT
        i.date,
        i.income,
        e.expense,
        i.income - e.expense AS balance
      FROM
        income i
        LEFT JOIN expense e ON i.date = e.date
      ORDER BY
        i.date`,
    [id]
  );
};

// Get History
models.getHistory = async (id, range, type) => {
  try {
    let dateRange = "";
    let limit = 4;
    let order = "DESC";

    if (range === "today") {
      dateRange = `
        AND t.created_at BETWEEN current_date::DATE AND current_date::DATE + INTERVAL '1 days'`;
      limit = 2;
    } else if (range === "weekly") {
      dateRange = `
        AND t.created_at BETWEEN 
            DATE_TRUNC('week', current_date)::DATE 
            AND (DATE_TRUNC('week', current_date) + INTERVAL '7 days')::DATE`;
      limit = 2;
      order = "ASC";
    } else if (range === "monthly") {
      dateRange = `
        AND t.created_at BETWEEN 
            DATE_TRUNC('month', current_date)::DATE
            AND (DATE_TRUNC('month', current_date) + INTERVAL '1 month')::DATE`;
      limit = 2;
      order = "ASC";
    } else if (range === "date") {
      const [start, end] = type.split("&");
      dateRange = `
        AND t.created_at BETWEEN '${start}' AND '${end}'::DATE + INTERVAL '1 DAY'`;
    }

    const query = `
      SELECT 
          t.receiver_id, 
          us.photo_profile AS sender_photo, 
          ur.photo_profile AS receiver_photo,
          us.name AS sender_name,
          ur.name AS receiver_name,
          t.amount, 
          t.notes
      FROM 
          transactions t
      JOIN 
          users us ON t.sender_id = us.id
      JOIN 
          users ur ON t.receiver_id = ur.id
      WHERE 
          ${
            type === "income"
              ? "t.receiver_id = $1"
              : type === "expense"
              ? "t.sender_id = $1"
              : "(t.sender_id = $1 OR t.receiver_id = $1)"
          }  
          ${dateRange}
      ORDER BY 
          t.created_at ${order}
      LIMIT $2`;

    const { rows } = await db.query(query, [id, limit]);
    return rows;
  } catch (error) {
    return error;
  }
};

module.exports = models;
