from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from ..core.database import Base # Importa a classe Base

class Cliente(Base):
    __tablename__ = 'clientes'
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    cpf_cnpj = Column(String(20), unique=True, nullable=False)
    telefone = Column(String(15))
    email = Column(String(120), unique=True)
    
    # Relacionamento (se você tiver a tabela OrdemServico)
    ordens_servico = relationship("OrdemServico", back_populates="cliente")