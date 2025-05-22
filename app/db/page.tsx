import pool from "@/lib/db"

export default async function Page() {
  const [rows] = await pool.query("SELECT * FROM tc_users")

  console.log("@@ROWS", rows)

  return <div></div>
}
