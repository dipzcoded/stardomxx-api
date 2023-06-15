import { app } from "./app";
import { config } from "dotenv";

config({ path: ".env" });

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`api running on PORT: ${PORT}`);
});
