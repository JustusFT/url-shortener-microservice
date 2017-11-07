function randomChar() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
  return characters[Math.floor(Math.random() * 64)];
}

module.exports = () => [...Array(8)].map(() => randomChar()).join('');
