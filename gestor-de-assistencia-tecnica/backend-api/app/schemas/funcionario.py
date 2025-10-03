from pydantic import BaseModel
from typing import Optional

# Esquema para CRIAR (entrada de dados)
class FuncionarioCreate(BaseModel):
    nome: str
    cargo: str

# Esquema para ATUALIZAR (entrada de dados)
class FuncionarioUpdate(BaseModel):
    nome: Optional[str] = None
    cargo: Optional[str] = None

# Esquema para RETORNAR/LER (saída de dados)
class Funcionario(FuncionarioCreate):
    id: int
    
    class Config:
        from_attributes = True
