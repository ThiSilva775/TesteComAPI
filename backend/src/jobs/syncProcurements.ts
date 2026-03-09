import { procurementsService } from '../modules/licitacoes/service/procurements.service';

async function run() {
  const result = await procurementsService.incrementalSync();
  console.log('Sync completed:', result);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
