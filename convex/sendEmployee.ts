import { mutation } from "./_generated/server";

export default mutation(async ({ db }, body) => {
  const employee = { ...body };
  db.insert("employees", employee);
});
