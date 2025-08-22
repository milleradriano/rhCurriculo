import multer from "multer";
import {promises as fs} from "fs"
import path from "path";
import sanitize from "sanitize-filename"; 

export const storageDocumento = multer.diskStorage({
  destination: async (req, file, cb) => {
    let uploadDirDocumento = "./src/images/docs/";
    uploadDirDocumento += req.body.idcandidato;
   
    try {
      await fs.access(uploadDirDocumento); // Verifica se o diretório existe
    } catch {
      await fs.mkdir(uploadDirDocumento, { recursive: true }); // Cria o diretório se não existir
    }
    cb(null, uploadDirDocumento);
  },
  filename: async (req, file, cb) => {
    let baseName = file.originalname; // Nome original
    // nao apagar aqui, faz a conversao de caractere no nome
    baseName = Buffer.from(baseName, "latin1").toString("utf-8"); 
  const ext = path.extname(baseName);
    const nameWithoutExt = path.basename(baseName, ext);
    let newFileName = nameWithoutExt + ext; // O nome final não é alterado

  
    cb(null, newFileName);
    let filePath = path.join(
      "./src/images/docs",
      req.body.idcandidato,
      newFileName
    );
 

    // Adiciona contador se o arquivo já existir
    while (
      await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false)
    ) {
      newFileName = `${nameWithoutExt}${ext}`;
      filePath = path.join(
        "./src/images/docs",
        req.body.idcandidato,
        newFileName
      );
     
    }

  
    cb(null, newFileName);
  },
});

export const uploadDocumento = multer({
  storage: storageDocumento,
  limits: { fileSize: 1024000 }, // Limite de 500 KB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'documento') {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Tipo de arquivo não suportado.'));
      }
    } else {
      cb(new Error('Campo inesperado. O campo deve ser "documento".'));
    }
  },
});
export const apagaDocumentoStorage = async (caminho: string, nome: string) => {
  const dir = `./src/images/docs/${caminho}`;
  const filePath = path.join(dir, nome);
  
  console.log(`Tentando deletar arquivo em: ${filePath}`);

  try {
    // Tenta deletar o arquivo diretamente. 
    // Se ele não existir, a promessa será rejeitada.
    await fs.unlink(filePath);
    
    console.log(`Arquivo ${filePath} deletado com sucesso.`);
    return { message: `Arquivo ${filePath} deletado com sucesso.` };
  } catch (error: any) {
    // Verifica se o erro é 'ENOENT' (Error NO ENtry), que significa 'arquivo não encontrado'
    if (error.code === 'ENOENT') {
      console.error(`Erro ao deletar arquivo: o arquivo ${filePath} não foi encontrado.`);
      return { error: `Erro ao deletar arquivo: o arquivo ${filePath} não foi encontrado.` };
    }
    
    // Se o erro for outro (permissão, etc.), retorna a mensagem de erro original
    console.error(`Erro ao deletar arquivo ${filePath}:`, error);
    return { error: `Erro ao deletar arquivo ${filePath}: ${error.message}` };
  }
};
//  export  const apagaDocumentoStorage = async (caminho: string, nome: string) => {
//   const dir = `./src/images/docs/${caminho}`;
//   console.log(`Tentando deletar arquivo em: ${dir}`);
//   const filePath = path.join(dir, nome);
//   console.log(`Caminho completo do arquivo: ${filePath}`);


//     try {      
//     await fs.access(filePath);
//     await fs.unlink(filePath);
//     console.log(`Arquivo ${filePath} deletado com sucesso.`);
//     return { message: `Arquivo ${filePath} deletado com sucesso.` };
//   } catch (error) {
//     console.error(`Erro ao deletar arquivo ${filePath}:`, error);
//     return { error: `Erro ao deletar arquivo ${filePath}: ${error}` };
//   }
// };
