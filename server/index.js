const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// === ROUTES ===

// 🔹 Ambil semua produk
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');

    if (result.rows.length === 0) {
      return res.json({ products: [], message: 'Tidak ada produk yang ditampilkan' });
    }

    res.json({ products: result.rows });
  } catch (err) {
    console.error('❌ Gagal mengambil produk:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data produk' });
  }
});

// 🔹 Ambil detail produk berdasarkan ID
app.get('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Gagal mengambil detail produk:', err.message);
    res.status(500).json({ error: 'Gagal mengambil detail produk' });
  }
});

// 🔹 Update produk
app.put('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    name,
    description,
    price,
    image,
    available,
    composition,
    category,
    origin,
    prep_time
  } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Nama dan harga wajib diisi.' });
  }

  try {
    await pool.query(
      `UPDATE products SET
        name = $1,
        description = $2,
        price = $3,
        image = $4,
        available = $5,
        composition = $6,
        category = $7,
        origin = $8,
        prep_time = $9
      WHERE id = $10`,
      [name, description, price, image, available, composition, category, origin, prep_time, id]
    );

    res.json({ message: 'Produk berhasil diperbarui' });
  } catch (err) {
    console.error('❌ Gagal memperbarui produk:', err.message);
    res.status(500).json({ message: 'Gagal menyimpan perubahan produk' });
  }
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
