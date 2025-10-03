# Configuração Central: Onde as variáveis de ambiente devem ser lidas (idealmente)
import os

# SUBSTITUA AQUI COM SUAS CREDENCIAIS DO MYSQL
DATABASE_URL = os.getenv("DATABASE_URL", "mysql://user:password@localhost:3306/assistencia_tecnica_db")