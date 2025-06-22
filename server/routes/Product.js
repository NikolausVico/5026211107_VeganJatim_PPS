// 🔹 API: Update produk by ID
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const {
    name, description, price, image,
    available, composition, category, origin, prep_time
  } = req.body;

  const query = `
    UPDATE products
    SET name = $1, description = $2, price = $3, image = $4,
        available = $5, composition = $6, category = $7,
        origin = $8, prep_time = $9
    WHERE id = $10
  `;

  const values = [
    name, description, price, image,
    available, composition, category, origin, prep_time,
    id
  ];

  pool.query(query, values, (err) => {
    if (err) {
      console.error('❌ Gagal mengupdate produk:', err.message);
      res.status(500).json({ error: 'Gagal mengupdate produk' });
    } else {
      res.json({ message: 'Produk berhasil diperbarui' });
    }
  });
});
