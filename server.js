const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');

const app = express();
const PORT = 3000;

const uploadXLSX = async (req, res, next) => {
    try {
      let path = req.file.path;
      var workbook = XLSX.readFile(path);
      var sheet_name_list = workbook.SheetNames;
      let jsonData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );
      if (jsonData.length === 0) {
        return res.status(400).json({
          success: false,
          message: "xml sheet has no data",
        });
      }
  
      return res.status(201).json({
        success: true,
        message: jsonData.length + " rows added to the database",
        data: jsonData,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
  
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.post("/upload", upload.single("xlsx"), uploadXLSX);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
