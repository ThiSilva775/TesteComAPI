import axios from 'axios';

const API_URL = 'http://localhost:3001';

async function testEndpoints() {
  console.log('🧪 Iniciando testes dos endpoints...\n');

  try {
    // Teste 1: Health Check
    console.log('📌 Teste 1: Health Check');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Status:', health.data);
    console.log();

    // Teste 2: Get Procurements
    console.log('📌 Teste 2: Listar Contratações');
    const procurements = await axios.get(`${API_URL}/api/procurements`);
    console.log('✅ Total de registros:', procurements.data.totalRegistros);
    console.log('✅ Dados recebidos:', procurements.data);
    console.log();

    // Teste 3: Get Dashboard
    console.log('📌 Teste 3: Dashboard');
    const dashboard = await axios.get(`${API_URL}/api/dashboard`);
    console.log('✅ Dashboard:', dashboard.data);
    console.log();

    console.log('✨ Todos os testes passaram com sucesso!');
  } catch (error: any) {
    console.error('❌ Erro durante os testes:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }
    process.exit(1);
  }
}

testEndpoints();
