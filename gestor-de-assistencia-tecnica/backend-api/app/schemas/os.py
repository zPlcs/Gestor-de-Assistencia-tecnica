from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Esquema para CRIAR (entrada de dados)
class OrdemServicoCreate(BaseModel):
    cliente_id: int
    equipamento: str
    descricao_defeito: str
    tecnico_id: Optional[int] = None
    data_previsao_entrega: Optional[datetime] = None
    valor_total: Optional[float] = 0.0

# Esquema para ATUALIZAR (entrada de dados - o status é o mais comum para mudar)
class OrdemServicoUpdate(BaseModel):
    status: Optional[str] = None
    tecnico_id: Optional[int] = None
    valor_total: Optional[float] = None
    data_previsao_entrega: Optional[datetime] = None

# Esquema para RETORNAR/LER (saída de dados)
class OrdemServico(OrdemServicoCreate):
    id: int
    status: str
    data_abertura: datetime
    
    class Config:
        from_attributes = True