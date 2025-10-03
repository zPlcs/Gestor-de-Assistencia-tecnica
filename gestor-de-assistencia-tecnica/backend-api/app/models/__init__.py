# Este arquivo garante que todos os modelos sejam importados para que
# o Base.metadata.create_all em main.py saiba quais tabelas criar.

from .cliente import Cliente
from .funcionario import Funcionario
from .os import OrdemServico 

# Adicione outros modelos conforme necessário.