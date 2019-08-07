import File from '../models/File';

class FileController {
  async store(req, res) {
    const { file } = req;
    const ret = await File.create({ name: file.filename, path: file.path });
    return res.json({ ret });
  }
}
export default new FileController();
