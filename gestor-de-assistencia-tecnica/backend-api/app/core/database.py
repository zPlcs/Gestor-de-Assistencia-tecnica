from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import DATABASE_URL

# Cria o engine de conexão (conexão bruta)
engine = create_engine(
    DATABASE_URL, 
    pool_recycle=3600 # Opcional: Recicla conexões ociosas
)

# Cria a classe Base para os modelos ORM
Base = declarative_base()

# Cria a sessão que será usada pelas rotas
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Função para injetar a sessão do DB nas rotas (Dependência do FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()