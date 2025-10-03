from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...models.os import OrdemServico as OSModel
from ...schemas.os import OrdemServico as OSSchema, OrdemServicoCreate, OrdemServicoUpdate

router = APIRouter(prefix="/ordens_servico", tags=["Ordens de Serviço"])

# POST: Criar Nova Ordem de Serviço
@router.post("/", response_model=OSSchema, status_code=status.HTTP_201_CREATED)
def create_os(os: OrdemServicoCreate, db: Session = Depends(get_db)):
    db_os = OSModel(**os.model_dump())
    db.add(db_os)
    db.commit()
    db.refresh(db_os)
    return db_os

# GET: Listar Todas as OS
@router.get("/", response_model=List[OSSchema])
def read_oss(db: Session = Depends(get_db)):
    oss = db.query(OSModel).all()
    return oss

# GET: Buscar OS por ID
@router.get("/{os_id}", response_model=OSSchema)
def read_os(os_id: int, db: Session = Depends(get_db)):
    os = db.query(OSModel).filter(OSModel.id == os_id).first()
    if os is None:
        raise HTTPException(status_code=404, detail="Ordem de Serviço não encontrada")
    return os

# PUT: Atualizar Ordem de Serviço (Ex: Mudar Status ou Atribuir Técnico)
@router.put("/{os_id}", response_model=OSSchema)
def update_os(os_id: int, os_update: OrdemServicoUpdate, db: Session = Depends(get_db)):
    db_os = db.query(OSModel).filter(OSModel.id == os_id).first()
    if db_os is None:
        raise HTTPException(status_code=404, detail="Ordem de Serviço não encontrada")
        
    for key, value in os_update.model_dump(exclude_unset=True).items():
        setattr(db_os, key, value)

    db.commit()
    db.refresh(db_os)
    return db_os

# DELETE: Deletar Ordem de Serviço
@router.delete("/{os_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_os(os_id: int, db: Session = Depends(get_db)):
    db_os = db.query(OSModel).filter(OSModel.id == os_id).first()
    if db_os is None:
        raise HTTPException(status_code=404, detail="Ordem de Serviço não encontrada")
    
    db.delete(db_os)
    db.commit()
    return {"ok": True}