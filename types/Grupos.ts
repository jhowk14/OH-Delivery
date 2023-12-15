import { Empresas } from "./Empresa"
import { GrupoTipo } from "./GrupoTipo"
import { Produto } from "./Produto"

export type Grupo = {
    GrupID: number
    GrupCodigo: number
    GrupDescricao: string
    GrupEmpresa: number
    Empresa: Empresas
    Produtos: Produto[]
    GrupoTipo: GrupoTipo[] | undefined
}