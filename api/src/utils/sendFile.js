module.exports = (file, root, res) =>
  new Promise((resolve, reject) => {
    res.sendFile(file, { root }, (err) => {
      if (err) return reject(err);

      resolve();
    });
  });
