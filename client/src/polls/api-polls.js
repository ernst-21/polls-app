const create = async (poll, credentials) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/polls/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + credentials.t
    },
    body: JSON.stringify(poll)
  });

const list = async () =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/polls/', {
    method: 'GET'
  });

const close = async (params, credentials) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/polls/close/' + params.pollId, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + credentials.t
    }
  });

const open = async (params, credentials) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/polls/open/' + params.pollId, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + credentials.t
    }
  });

const remove = async (params, credentials) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/polls/' + params.pollId, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + credentials.t
    }
  });

const vote = async (params, credentials, user) =>
  // eslint-disable-next-line
  await fetch('http://localhost:5000/api/polls/vote/' + params.pollId, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + credentials.t
    },
    body: JSON.stringify(user)
  });

export { create, list, remove, vote, close, open };
