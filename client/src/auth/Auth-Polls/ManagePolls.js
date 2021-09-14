import React, { useEffect, useState, memo } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { close, list, remove, open } from '../../polls/api-polls';
import { Button, Modal, Grid } from 'antd';
import AboveListBar from '../../core/AboveListBar';
import PollsStats from '../../polls/PollsStats';
import { success } from '../../components/Message';
import auth from '../Auth-User/auth-helper';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PollsTable from '../../polls/PollsTable';

const { useBreakpoint } = Grid;

const ManagePolls = () => {
  const jwt = auth.isAuthenticated();
  const [pollId, setPollId] = useState('');
  const [pollsClosed, setPollsClosed] = useState([]);
  const [pollsNew, setPollsNew] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sourceData, setSourceData] = useState([]);
  const screens = useBreakpoint();
  const { data: polls = [], isLoading, isError } = useQuery('polls', () => list().then(res => res.json()).then(data => data.reverse()));

  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation((id) => remove({ pollId: id }, { t: jwt.token }).then(res => res.json()).then(data => data), {
    onSuccess: () => {
      queryClient.invalidateQueries('polls');
      success('Poll successfully deleted');
    }
  });

  const { mutate: closeMutation } = useMutation((id) => close({ pollId: id }, { t: jwt.token }).then(res => res.json().then(data => data)), {
    onSuccess: () => {
      queryClient.invalidateQueries('polls');
      success('Poll successfully closed');
    }
  });

  const { mutate: openMutation } = useMutation((id) => open({ pollId: id }, { t: jwt.token }).then(res => res.json()).then(data => data), {
    onSuccess: () => {
      queryClient.invalidateQueries('polls');
      success('Poll successfully open');
    }
  });

  useEffect(() => {
    if (polls && polls.length > 0) {
      setPollsClosed(polls.filter(item => item.closed === true));
      setPollsNew(polls.filter((item) => item.voters.length === 0));
    }
  }, [polls]);

  const showModal = (id) => {
    setPollId(id);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    deleteMutation(pollId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (isError) {
    return <Redirect to='/info-network-error' />;
  }

  return (
    <div className='polls'>
      <AboveListBar>
        <Link to='/create-poll'>
          <Button type='primary'>CREATE</Button>
        </Link>
        <PollsStats polls={polls}
          pollsClosed={pollsClosed}
          pollsNew={pollsNew} />
      </AboveListBar>
      <div className="polls-container">
        <PollsTable
          className={screens.xs || screens.sm ? 'table-x' : 'table'}
          isLoading={isLoading}
          sourceData={sourceData}
          showModal={showModal}
          closePoll={closeMutation}
          openPoll={openMutation}
          isManaging={true}
          setSourceData={setSourceData}
          polls={polls}
        />
        <Modal title="Delete Poll" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <p>By clicking OK this poll will be deleted. This action cannot be undone</p>
        </Modal>
      </div>
    </div>

  );
};

export default memo(ManagePolls);
