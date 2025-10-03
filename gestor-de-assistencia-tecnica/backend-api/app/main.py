from fastapi import FastAPI
from sqlalchemy_utils import database_exists, create_database
from .core.database import engine, Base
from .api.api_router import api_router

# Importa todos os modelos para garantir que o SQLAlchemy saiba quais tabelas criar
from .models import * # Inicializa o FastAPI
app = FastAPI(title="Assistência Técnica API")

# Lógica para criar o banco de dados e as tabelas na inicialização
@app.on_event("startup")
def startup_event():
    # Cria o DB se não existir
    if not database_exists(engine.url):
        create_database(engine.url)
    
    # Cria as tabelas se não existirem (Base.metadata.create_all)
    Base.metadata.create_all(bind=engine)
    print("Banco de dados e tabelas verificados/criados com sucesso.")

# Inclui o Router principal que agrega todas as rotas CRUD
app.include_router(api_router, prefix="/api/v1")