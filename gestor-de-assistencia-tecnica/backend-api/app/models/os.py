from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func # Para usar func.now()
from ..core.database import Base

class OrdemServico(Base):
    __tablename__ = 'ordens_servico'
    
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey('clientes.id'), nullable=False)
    tecnico_id = Column(Integer, ForeignKey('funcionarios.id'), nullable=True) # Pode ser nulo no início
    
    equipamento = Column(String(100), nullable=False)
    descricao_defeito = Column(Text, nullable=False)
    status = Column(String(30), default='Em Aberto', nullable=False)
    data_abertura = Column(DateTime, server_default=func.now())
    data_previsao_entrega = Column(DateTime, nullable=True)
    valor_total = Column(Float, default=0.0)
    
    # Mapeamento dos relacionamentos
    cliente = relationship("Cliente", back_populates="ordens_servico")
    tecnico = relationship("Funcionario", back_populates="servicos_atribuidos")
