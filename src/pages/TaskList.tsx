import { useEffect, useState } from 'react';
import { Table, Button, message as antMessage, Calendar } from 'antd';
import { Link } from 'react-router-dom';
import { Task, taskService } from '../services/taskService';
import React from 'react';
import dayjs from 'dayjs';

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | undefined>(
    undefined,
  );
  const [message, contextHolder] = antMessage.useMessage();

  const fetchTasks = async (date?: string) => {
    setLoading(true);
    try {
      const response = await taskService.getAll(date);

      setTasks(response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch tasks';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onDateSelect = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    const dateString = date.format('YYYY-MM-DD');
    fetchTasks(dateString);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Category',
      key: 'category',
      render: (_: any, record: Task) => {
        return record.category.name;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate: string) =>
        dueDate ? new Date(dueDate).toLocaleDateString() : '-',
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <Link to="/tasks/create">
              <Button type="primary">Create Task</Button>
            </Link>
          </div>
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            loading={loading}
          />
        </div>
        <div style={{ width: 300 }}>
          <Calendar onSelect={onDateSelect} value={selectedDate} />
        </div>
      </div>
    </>
  );
};

export default TaskList;
