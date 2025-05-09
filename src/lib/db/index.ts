import mysql from 'mysql2/promise';

// Configuração da conexão com o banco de dados MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dashboard_financeiro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Cria um pool de conexões reutilizáveis
const pool = mysql.createPool(dbConfig);

// Função para executar consultas SQL
export async function executeQuery<T = any>(
  query: string, 
  params: any[] = []
): Promise<T> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T;
  } catch (error) {
    console.error('Erro ao executar consulta:', error);
    throw error;
  }
}

// Função para testar a conexão com o banco de dados
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    return false;
  }
}