import multer from "multer";
import {promises as fs} from "fs"
import path from "path";

export const storageDocumento = multer.diskStorage({
  destination: async (req, file, cb) => {
    let uploadDirDocumento = "./src/images/docs/";
    uploadDirDocumento += req.body.idcandidato;
    console.log("Diretório de upload do documento:", uploadDirDocumento);
    try {
      await fs.access(uploadDirDocumento); // Verifica se o diretório existe
    } catch {
      await fs.mkdir(uploadDirDocumento, { recursive: true }); // Cria o diretório se não existir
    }
    cb(null, uploadDirDocumento);
  },
  filename: async (req, file, cb) => {
    let baseName = file.originalname; // Nome original
    const ext = path.extname(baseName);
    const nameWithoutExt = path.basename(baseName, ext);
    let newFileName = nameWithoutExt + ext; // Preserva o nome original
    let filePath = path.join(
      "./src/images/docs",
      req.body.idcandidato,
      newFileName
    );
    let counter = 1;

    // Adiciona contador se o arquivo já existir
    while (
      await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false)
    ) {
      newFileName = `${nameWithoutExt}-${counter}${ext}`;
      filePath = path.join(
        "./src/images/docs",
        req.body.idcandidato,
        newFileName
      );
      counter++;
    }

    console.log("Nome final do arquivo:", newFileName); // Depuração
    cb(null, newFileName);
  },
});

 export  const uploadDocumento = multer({
  storage: storageDocumento,

  // Verifique se o campo no frontend é 'documento'
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "documento") {
      cb(null, true);
    } else {
      cb(new Error("Unexpected field"));
    }
  },
});

 export  const apagaDocumentoStorage = async (caminho: string, nome: string) => {
  const dir = `./src/images/docs/${caminho}`;
  const filePath = path.join(dir, nome);
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
    console.log(`Arquivo ${filePath} deletado com sucesso.`);
    return { message: `Arquivo ${filePath} deletado com sucesso.` };
  } catch (error) {
    console.error(`Erro ao deletar arquivo ${filePath}:`, error);
    return { error: `Erro ao deletar arquivo ${filePath}: ${error}` };
  }
};
