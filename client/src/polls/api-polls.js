const create = async (poll, credentials) => {
  try {
    let response = await fetch('http://localhost:5000/api/polls/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      },
      body: JSON.stringify(poll)
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};


const list = async () => await fetch('http://localhost:5000/api/polls/', {
  method: 'GET',
});

// const read = async (params, credentials, signal) => {
//   try {
//     let response = await fetch('http://localhost:5000/api/polls/' + params.pollId, {
//       method: 'GET',
//       signal: signal,
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

const update = async (params, credentials, poll) => {
  try {
    let response = await fetch('http://localhost:5000/api/polls/' + params.pollId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t
      },
      body: JSON.stringify(poll)
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const close = async (params, credentials) => {
  try {
    let response = await fetch('http://localhost:5000/api/polls/close/' + params.pollId, {
      method: 'PUT',
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

const open = async (params, credentials) => {
  try {
    let response = await fetch('http://localhost:5000/api/polls/open/' + params.pollId, {
      method: 'PUT',
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

const remove = async (params, credentials) => {
  try {
    let response = await fetch('http://localhost:5000/api/polls/' + params.pollId, {
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

const vote = async(params, credentials, user) => await fetch('http://localhost:5000/api/polls/vote/' + params.pollId, {
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + credentials.t
  },
  body: JSON.stringify(user)
});



export { create, list, update, remove, vote, close, open };
