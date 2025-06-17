import express from 'express';
import bodyParser from 'body-parser';
import stateController from './controllers/stateController';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', stateController);

app.listen(PORT, () => console.log(`Backend listening on localhost:${PORT}`));
