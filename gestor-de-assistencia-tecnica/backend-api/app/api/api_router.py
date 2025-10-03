from fastapi import APIRouter
# Importa as rotas de cada módulo
from .endpoints import clientes, funcionarios, ordens_servico

api_router = APIRouter()

# Inclui as rotas de Clientes
api_router.include_router(clientes.router)

# Inclui as rotas de Funcionários
api_router.include_router(funcionarios.router)

# Inclui as rotas de Ordens de Serviço
api_router.include_router(ordens_servico.router)

# Adicione outros routers aqui