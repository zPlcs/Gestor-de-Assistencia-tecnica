
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...models.funcionario import Funcionario as FuncionarioModel
from ...schemas.funcionario import Funcionario as FuncionarioSchema, FuncionarioCreate, FuncionarioUpdate

router = APIRouter(prefix="/funcionarios", tags=["Funcionários"])

# POST: Criar Funcionario
@router.post("/", response_model=FuncionarioSchema, status_code=status.HTTP_201_CREATED)
def create_funcionario(funcionario: FuncionarioCreate, db: Session = Depends(get_db)):
    db_funcionario = FuncionarioModel(**funcionario.model_dump())
    db.add(db_funcionario)
    db.commit()
    db.refresh(db_funcionario)
    return db_funcionario

# GET: Listar Todos
@router.get("/", response_model=List[FuncionarioSchema])
def read_funcionarios(db: Session = Depends(get_db)):
    funcionarios = db.query(FuncionarioModel).all()
    return funcionarios

# GET: Buscar por ID
@router.get("/{funcionario_id}", response_model=FuncionarioSchema)
def read_funcionario(funcionario_id: int, db: Session = Depends(get_db)):
    funcionario = db.query(FuncionarioModel).filter(FuncionarioModel.id == funcionario_id).first()
    if funcionario is None:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    return funcionario

# PUT: Atualizar Funcionario
@router.put("/{funcionario_id}", response_model=FuncionarioSchema)
def update_funcionario(funcionario_id: int, funcionario_update: FuncionarioUpdate, db: Session = Depends(get_db)):
    db_funcionario = db.query(FuncionarioModel).filter(FuncionarioModel.id == funcionario_id).first()
    if db_funcionario is None:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
        
    for key, value in funcionario_update.model_dump(exclude_unset=True).items():
        setattr(db_funcionario, key, value)

    db.commit()
    db.refresh(db_funcionario)
    return db_funcionario

# DELETE: Deletar Funcionario
@router.delete("/{funcionario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_funcionario(funcionario_id: int, db: Session = Depends(get_db)):
    db_funcionario = db.query(FuncionarioModel).filter(FuncionarioModel.id == funcionario_id).first()
    if db_funcionario is None:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    
    db.delete(db_funcionario)
    db.commit()
    return {"ok": True}
