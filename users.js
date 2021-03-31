let users = [];

//addUser()
const addUser = ({ id, room, userName }) => {
  userName = userName.trim().toLowerCase();
  room = room.trim().toLowerCase();
  const existingUser = users.find(
    (user) => user.room == room && user.userName == userName
  );
  if (existingUser)
    return {
      error: "Username is taken.",
    };
  const user = {
    id,
    room,
    userName,
  };
  users.push(user);
  return { user };
};

//removeUser()
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id == id);
  if (index != -1) return users.splice(index, 1)[0];
};

//getUser
const getUser = (id) => users.find((user) => user.id == id);

const getUsersInRoom = (room) => users.filter((user) => (user.room = room));

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
