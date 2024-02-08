const username = 'admin@gmail.com';
db.users.updateOne(
  { username: username },
  { $set: { gems: 10000, parrots: 10000 } }
);

