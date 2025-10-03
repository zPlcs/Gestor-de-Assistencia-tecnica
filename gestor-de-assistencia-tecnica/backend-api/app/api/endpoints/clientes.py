from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...models.cliente import Cliente as ClienteModel
from ...schemas.cliente import Cliente as ClienteSchema, ClienteCreate

# Este Router será responsável pelas operações CRUD na tabela 'Clientes'
router = APIRouter(prefix="/clientes", tags=["Clientes"])

# Rota POST: Criar Cliente
@router.post("/", response_model=ClienteSchema)
def create_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    # Lógica de validação pode vir aqui
    db_cliente = ClienteModel(**cliente.model_dump())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

# Rota GET: Listar Todos
@router.get("/", response_model=list[ClienteSchema])
def read_clientes(db: Session = Depends(get_db)):
    clientes = db.query(ClienteModel).all()
    return clientes

# Rota GET: Buscar por ID
@router.get("/{cliente_id}", response_model=ClienteSchema)
def read_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(ClienteModel).filter(ClienteModel.id == cliente_id).first()
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return cliente

# Rota PUT: Atualizar Cliente (Exemplo)
@router.put("/{cliente_id}", response_model=ClienteSchema)
def update_cliente(cliente_id: int, cliente_update: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = db.query(ClienteModel).filter(ClienteModel.id == cliente_id).first()
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
    # Atualiza campos (Pydantic .model_dump() converte para dict)
    for key, value in cliente_update.model_dump(exclude_unset=True).items():
        setattr(db_cliente, key, value)

    db.commit()
    db.refresh(db_cliente)
    return db_cliente
