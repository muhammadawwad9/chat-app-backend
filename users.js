let users = [];

//addUser()
const addUser = ({ id, room, userName }) => {
  userName = userName.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!userName || !room)
    return {
      error: "Please Fill Up The Fields",
    };
  else if (userName.length > 12 || userName.length < 4)
    return {
      error: "Username must be between 4-12 characters",
    };
  else if (room.length > 16)
    return {
      error: "Room can be max 16 characters",
    };

  const existingUser = users.find((user) => user.userName == userName);
  if (existingUser) {
    return {
      error: "Someone is using this username right now.",
    };
  }

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

const getUsersInRoom = (room) => users.filter((user) => user.room == room);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
