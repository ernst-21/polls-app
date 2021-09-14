const createUser = async (user) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/users/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

const listUsers = async () =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/users/', {
    method: 'GET'
  });

const read = async (params, credentials) => {
  // eslint-disable-next-line
  return await fetch('http://localhost:5000/api/users/' + params.userId, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + credentials.t
    }
  });
};

const updateProfile = async (params, credentials, user) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/users/' + params.userId, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + credentials.t
    },
    body: JSON.stringify(user)
  });

const updateUser = async (params, credentials, user) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/users/edit-user/' + params.userId, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + credentials.t
    },
    body: JSON.stringify(user)
  });

const removeProfile = async (params, credentials) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/users/' + params.userId, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + credentials.t
    }
  });

const removeUser = async (params, credentials) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/users/remove-user/' + params.userId, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + credentials.t
    }
  });

const emailToPass = async (user) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/users/reset', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

const resetPass = async (params, user) =>
  // eslint-disable-next-line
  await fetch(
    'http://localhost:5000/api/users/reset-password/' + params.token,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }
  );

export {
  createUser,
  listUsers,
  read,
  emailToPass,
  resetPass,
  updateUser,
  updateProfile,
  removeUser,
  removeProfile
};
