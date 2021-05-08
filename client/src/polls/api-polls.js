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

const list = async (signal) => {
  try {
    let response = await fetch('http://localhost:5000/api/polls/', {
      method: 'GET',
      signal: signal
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch('http://localhost:5000/api/polls/' + params.pollId, {
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

const voteYes = async (params, credentials, poll) => {
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

const voteNo = async (params, credentials, poll) => {
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

export { create, list, read, update, remove, voteYes, voteNo };
