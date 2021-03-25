db.createUser({
  user: "admin",
  pwd: "example",
  roles: [
    {
      role: "readWrite",
      db: "test",
    },
  ],
});
