import { env } from './config/env';
import { createApp } from './app';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Backend running on port ${env.PORT}`);
});
