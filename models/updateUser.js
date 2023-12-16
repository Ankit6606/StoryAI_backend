const username = 'admin@gmail.com';
db.users.updateOne(
  { username: username },
  { $set: { gems: 100, parrots: 100 } }
);

