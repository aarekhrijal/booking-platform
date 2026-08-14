const express = require('express');
const multer = require('multer');
const supabase = require('../supabase-client/storage');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const fileName = `${Date.now()}-${req.file.originalname}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

  if (error) {
    return res.status(500).json({ error: 'Upload failed' });
  }

  const { data } = supabase.storage.from('images').getPublicUrl(fileName);

  res.json({ url: data.publicUrl });
});

module.exports = router;