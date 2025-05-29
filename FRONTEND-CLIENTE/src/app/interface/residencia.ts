export interface interfaceResidencia {
    idcandidato: string;    
    cpf: string;
    cep: string;
    estado: string;
    cidade: string;
    endereco: string;
    bairro: string;
    numero: string;
}

export interface interfaceCep{
  cep: string;
  uf: string;
  localidade: string;
  bairro: string;
  logradouro: string;  
}
