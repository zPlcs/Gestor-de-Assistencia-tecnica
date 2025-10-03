from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..core.database import Base

class Funcionario(Base):
    __tablename__ = 'funcionarios'
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    cargo = Column(String(50), nullable=False) # Ex: Técnico, Atendente
    # Nota: Senhas e autenticação seriam adicionadas aqui em um projeto real.

    # Relacionamento (se você tiver a tabela OrdemServico)
    servicos_atribuidos = relationship("OrdemServico", back_populates="tecnico")
