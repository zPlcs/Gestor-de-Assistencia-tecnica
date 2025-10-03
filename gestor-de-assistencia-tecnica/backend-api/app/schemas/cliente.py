# Pydantic Schema: Garante que os dados de entrada/saída da API são válidos.
from pydantic import BaseModel
from typing import Optional

# Esquema para CRIAR (entrada de dados)
class ClienteCreate(BaseModel):
    nome: str
    cpf_cnpj: str
    telefone: Optional[str] = None
    email: Optional[str] = None

# Esquema para RETORNAR/LER (saída de dados)
class Cliente(ClienteCreate):
    id: int
    
    class Config:
        # Permite que o Pydantic leia dados de um objeto ORM (SQLAlchemy)
        from_attributes = True