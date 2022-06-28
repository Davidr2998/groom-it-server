const users = [];

const sanitizeElement = (element) => {
  if (element === undefined || element.length < 0) {
    return { error: "Cannot sanitize an empty element" };
  }
  if (typeof element !== "string") {
    return { error: "Element is not a string" };
  }
  return element.trim().toLowerCase();
};

const addUser = ({ id, username, room }) => {
  username = sanitizeElement(username);
  room = sanitizeElement(room);

  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  if (existingUser) {
    return { error: "Username is already in, use please try another one" };
  }

  //Store the user
  const user = { id, username, room };
  users.push(user);
  console.log("New list of users is: ", users);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1);
  }
};

const getUsersInRoom = (room) => {
  room = sanitizeElement(room);
  return users.filter((user) => user.room === room);
};

export { addUser, removeUser, getUsersInRoom };
