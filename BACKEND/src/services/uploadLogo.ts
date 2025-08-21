import multer from "multer";
import {promises as fs} from "fs"
import path from "path";

export const storageDocumento = multer.diskStorage({
  destination: async (req, file, cb) => {
    let uploadDirLogo = "./src/images/logo/";
    //uploadDirLogo += req.body.idcandidato;
    console.log("Diretório de upload do logo:", uploadDirLogo);
    try {
      await fs.access(uploadDirLogo); // Verifica se o diretório existe
    } catch {
      await fs.mkdir(uploadDirLogo, { recursive: true }); // Cria o diretório se não existir
    }
    cb(null, uploadDirLogo);
  },
  filename: async (req, file, cb) => {
    let baseName = file.originalname; // Nome original
    const ext = path.extname(baseName);
    const nameWithoutExt = path.basename(baseName, ext);
    let newFileName = nameWithoutExt + ext; // Preserva o nome original
    let filePath = path.join(
      "./src/images/logo",      
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
        "./src/images/logo",       
        newFileName
      );
      counter++;
    }

    console.log("Nome final do arquivo:", newFileName); // Depuração
    cb(null, newFileName);
  },
});

 export  const uploadLogo = multer({
  storage: storageDocumento,

  // Verifique se o campo no frontend é 'documento'
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "logo") {
      cb(null, true);
    } else {
      cb(new Error("Unexpected field"));
    }
  },
});