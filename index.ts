import helmet from "helmet";
import  cookieParser from "cookie-parser"
import cors from "cors"
import express from "express";
import { dataBase, dataSource } from "./src/config/database/data-source";
import { runSeeders } from "typeorm-extension";
import router from "./src/routes/routes";
import path from "path";

const app = express();

app.use(helmet());
app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api', router)
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, host, async () => {
    await dataBase.connect();
    await runSeeders(dataSource);

    console.log(`[ ready ] http://${host}:${port}`);
});
app.use((err: any, req: any, res: any, next: any) => {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});
