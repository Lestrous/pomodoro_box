import express from 'express';
import ReactDOM from 'react-dom/server';
import { indexTemplate } from './indexTemplate';
import { App } from '../App';
import compression from 'compression';

console.log(`Server.js file start`);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;
// eslint-disable-next-line no-undef
const IS_DEV = process.env.NODE_ENV !== 'production';

console.log(`Server PORT is ${PORT}`);

const app = express();

if (!IS_DEV) {
  app.use(compression());
}

app.use('/static', express.static('./dist/client'));

app.get('*', (req, res) => {
  res.send(indexTemplate(ReactDOM.renderToString(App())));
});

app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
