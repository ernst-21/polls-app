const createUser = async (user) => {
  try {
    let response = await fetch('http://localhost:5000/api/users/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};


const list = async () => await fetch('http://localhost:5000/api/users/', {
  method: 'GET'
});

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch('http://localhost:5000/api/users/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      }
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const update = async (params, credentials, user) => {
  try {
    let response = await fetch('http://localhost:5000/api/users/' + params.userId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      },
      body: JSON.stringify(user)
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (params, credentials, user) => {
  try {
    let response = await fetch('http://localhost:5000/api/users/edit-user/' + params.userId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      },
      body: JSON.stringify(user)
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

// const remove = async (params, credentials) => {
//   try {
//     let response = await fetch('http://localhost:5000/api/users/' + params.userId, {
//       method: 'DELETE',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + credentials.t
//       }
//     });
//     return await response.json();
//   } catch (err) {
//     console.log(err);
//   }
// };

const removeUser = async (params, credentials) => {
  try {
    let response = await fetch('http://localhost:5000/api/users/remove-user/' + params.userId, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      }
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const emailToPass = async (user) => {
  try {
    let response = await fetch('http://localhost:5000/api/users/reset', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const resetPass = async (params, user) => {
  try {
    let response = await fetch('http://localhost:5000/api/users/reset-password/' + params.token, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { createUser, list, read, update, emailToPass, resetPass, updateUser, removeUser };
