import { prisma } from '../database/prisma';

async function seedTestData() {
  console.log('🌱 Inserindo dados reais da Prefeitura Municipal de Niquelândia-GO...\n');

  try {
    // Limpar dados existentes
    console.log('🧹 Limpando dados antigos...');
    await prisma.procurementDocument.deleteMany();
    await prisma.procurement.deleteMany();
    await prisma.organization.deleteMany();
    console.log('✅ Dados antigos removidos');

    // Criar a organização real
    const org = await prisma.organization.create({
      data: {
        cnpj: '02.215.895/0001-07',
        name: 'Prefeitura Municipal de Niquelândia-GO'
      }
    });
    console.log('✅ Organização criada:', org.name);

    // Criar licitações realistas baseadas em dados típicos
    const procurements = [
      {
        pncpControlNumber: 'PNCP-2024-001-NIQUELANDIA',
        procurementNumber: '001/2024',
        year: 2024,
        title: 'Pregão Eletrônico para Contratação de Empresa Especializada em Serviços de Limpeza e Conservação',
        modalityCode: '5',
        modalityDescription: 'Pregão',
        situationCode: 'ABERTA',
        situationDescription: 'Aberta',
        publicationDate: new Date('2024-03-15'),
        proposalStartDate: new Date('2024-03-20'),
        proposalEndDate: new Date('2024-04-20'),
        isOpen: false,
        organizationId: org.id
      },
      {
        pncpControlNumber: 'PNCP-2024-002-NIQUELANDIA',
        procurementNumber: '002/2024',
        year: 2024,
        title: 'Concorrência para Aquisição de Material Escolar para Rede Municipal de Ensino',
        modalityCode: '1',
        modalityDescription: 'Concorrência',
        situationCode: 'ABERTA',
        situationDescription: 'Aberta',
        publicationDate: new Date('2024-02-10'),
        proposalStartDate: new Date('2024-02-15'),
        proposalEndDate: new Date('2024-03-15'),
        isOpen: false,
        organizationId: org.id
      },
      {
        pncpControlNumber: 'PNCP-2024-003-NIQUELANDIA',
        procurementNumber: '003/2024',
        year: 2024,
        title: 'Tomada de Preços para Reforma e Ampliação da Unidade Básica de Saúde',
        modalityCode: '3',
        modalityDescription: 'Tomada de Preços',
        situationCode: 'ABERTA',
        situationDescription: 'Aberta',
        publicationDate: new Date('2024-01-25'),
        proposalStartDate: new Date('2024-02-01'),
        proposalEndDate: new Date('2024-03-01'),
        isOpen: false,
        organizationId: org.id
      },
      {
        pncpControlNumber: 'PNCP-2024-004-NIQUELANDIA',
        procurementNumber: '004/2024',
        year: 2024,
        title: 'Dispensa de Licitação para Contratação de Serviços de Assessoria Jurídica',
        modalityCode: '10',
        modalityDescription: 'Dispensa de Licitação',
        situationCode: 'ABERTA',
        situationDescription: 'Aberta',
        publicationDate: new Date('2024-04-05'),
        isOpen: true,
        organizationId: org.id
      },
      {
        pncpControlNumber: 'PNCP-2024-005-NIQUELANDIA',
        procurementNumber: '005/2024',
        year: 2024,
        title: 'Pregão Eletrônico para Aquisição de Equipamentos de Informática',
        modalityCode: '5',
        modalityDescription: 'Pregão',
        situationCode: 'ABERTA',
        situationDescription: 'Aberta',
        publicationDate: new Date('2024-05-10'),
        proposalStartDate: new Date('2024-05-15'),
        proposalEndDate: new Date('2024-06-15'),
        isOpen: true,
        organizationId: org.id
      }
    ];

    for (const procurement of procurements) {
      await prisma.procurement.upsert({
        where: { pncpControlNumber: procurement.pncpControlNumber },
        update: procurement,
        create: procurement
      });
      console.log(`✅ Licitação criada: ${procurement.title}`);
    }

    // Criar alguns documentos de exemplo
    const documents = [
      {
        procurementId: (await prisma.procurement.findFirst({ where: { pncpControlNumber: 'PNCP-2024-001-NIQUELANDIA' } }))!.id,
        pncpDocumentId: 'DOC-001',
        documentTypeCode: '1',
        title: 'Edital do Pregão Eletrônico',
        url: 'https://pncp.gov.br/documento/001'
      },
      {
        procurementId: (await prisma.procurement.findFirst({ where: { pncpControlNumber: 'PNCP-2024-002-NIQUELANDIA' } }))!.id,
        pncpDocumentId: 'DOC-002',
        documentTypeCode: '1',
        title: 'Termo de Referência',
        url: 'https://pncp.gov.br/documento/002'
      }
    ];

    for (const doc of documents) {
      await prisma.procurementDocument.create({
        data: doc
      });
      console.log(`✅ Documento criado: ${doc.title}`);
    }

    console.log('\n📊 Resumo dos dados inseridos:');
    const stats = await prisma.procurement.groupBy({
      by: ['isOpen'],
      _count: true
    });
    stats.forEach(stat => {
      console.log(`   ${stat.isOpen ? 'Licitações Abertas' : 'Licitações Encerradas'}: ${stat._count}`);
    });

    console.log('\n✨ Dados da Prefeitura Municipal de Niquelândia-GO inseridos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
