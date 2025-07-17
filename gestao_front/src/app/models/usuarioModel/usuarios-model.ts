export interface UsuarioCreate {
  nome: string;
  login: string;
  senha: string;
  perfil: 'Administrador' | 'Gerencial';
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

export interface Usuario extends UsuarioCreate {
  id: string;
}
