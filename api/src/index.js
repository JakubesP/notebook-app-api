const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const prepareServer = require("./server");
const appConfig = require("./config/app");

(async () => {
  const server = await prepareServer();

  server.listen(appConfig.PORT, () => {
    console.log(`App is running on port ${appConfig.PORT}`);
  });
})();
