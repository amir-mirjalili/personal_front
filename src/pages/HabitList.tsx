import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Progress,
  Calendar,
  Space,
  message as antMessage,
} from 'antd';
import { Link } from 'react-router-dom';
import { Habit, habitService, HabitLog } from '../services/habitService';
import React from 'react';
import dayjs from 'dayjs';

const HabitList = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [message, contextHolder] = antMessage.useMessage();

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const response = await habitService.getAll();
      setHabits(response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch habits';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTick = async (
    habitId: string,
    ticked: boolean,
    date?: string,
  ) => {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      if (ticked) {
        await habitService.tick(habitId, targetDate);
        message.success('Habit ticked successfully!');
      } else {
        await habitService.penalty(habitId, targetDate);
        message.info('Habit penalty applied');
      }
      // Refresh habits to get updated scores
      fetchHabits();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update habit';
      message.error(errorMessage);
    }
  };

  const getLogStatus = (date: dayjs.Dayjs, habit: Habit) => {
    const log = habit.habitLogs?.find((log) =>
      dayjs(log.date).isSame(date, 'day'),
    );
    return log ? log.ticked : null;
  };

  const dateCellRender = (date: dayjs.Dayjs) => {
    // Check status across all habits for this date
    let completedCount = 0;
    let missedCount = 0;
    let totalHabits = habits.length;

    habits.forEach((habit) => {
      const status = getLogStatus(date, habit);
      if (status === true) {
        completedCount++;
      } else if (status === false) {
        missedCount++;
      }
    });

    let color = '';
    if (completedCount === totalHabits && totalHabits > 0) {
      color = 'green'; // All habits completed
    } else if (missedCount > 0) {
      color = 'red'; // Some habits missed
    } else if (completedCount > 0) {
      color = 'orange'; // Some habits completed, others no record
    } else {
      color = 'gray'; // No records
    }

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: color,
          opacity: 0.3,
          borderRadius: '4px',
        }}
      />
    );
  };

  const calculateMonthlyAverage = (habit: Habit) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Calculate expected completions based on duration
    let expectedCompletions = 0;
    switch (habit.duration) {
      case 'DAILY':
        expectedCompletions = daysInMonth;
        break;
      case 'WEAKLY':
        expectedCompletions = Math.ceil(daysInMonth / 7); // Roughly weekly
        break;
      case 'MONTHLY':
        expectedCompletions = 1;
        break;
      default:
        expectedCompletions = daysInMonth;
    }

    // Calculate percentage based on score vs expected
    const percentage =
      expectedCompletions > 0 ? (habit.score / expectedCompletions) * 100 : 0;
    return Math.min(percentage, 100); // Cap at 100%
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const getHabitStatusForDate = (habit: Habit, date: dayjs.Dayjs) => {
    const log = habit.habitLogs?.find((log) =>
      dayjs(log.date).isSame(date, 'day'),
    );
    return log ? log.ticked : null;
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: `Status for ${selectedDate.format('YYYY-MM-DD')}`,
      key: 'dateStatus',
      render: (_: any, record: Habit) => {
        const status = getHabitStatusForDate(record, selectedDate);
        let statusText = 'No Record';
        let color = 'gray';

        if (status === true) {
          statusText = 'Completed';
          color = 'green';
        } else if (status === false) {
          statusText = 'Missed';
          color = 'red';
        }

        return <span style={{ color }}>{statusText}</span>;
      },
    },
    {
      title: 'Monthly Average',
      key: 'monthlyAverage',
      render: (_: any, record: Habit) => (
        <Progress
          percent={Math.round(calculateMonthlyAverage(record))}
          size="small"
          status={
            calculateMonthlyAverage(record) >= 80
              ? 'success'
              : calculateMonthlyAverage(record) >= 50
                ? 'normal'
                : 'exception'
          }
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Habit) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() =>
              handleTick(record.id, true, selectedDate.format('YYYY-MM-DD'))
            }
          >
            Tick
          </Button>
          <Button
            type="link"
            danger
            onClick={() =>
              handleTick(record.id, false, selectedDate.format('YYYY-MM-DD'))
            }
          >
            Penalty
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div>
        <div style={{ marginBottom: 16 }}>
          <Link to="/habits/create">
            <Button type="primary">Create Habit</Button>
          </Link>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Calendar
            value={selectedDate}
            onSelect={setSelectedDate}
            cellRender={dateCellRender}
            style={{ width: '100%' }}
          />
          <div style={{ marginTop: 8, textAlign: 'center' }}>
            Selected Date: {selectedDate.format('YYYY-MM-DD')}
          </div>
          <div style={{ marginTop: 8, textAlign: 'center' }}>
            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'green',
                    opacity: 0.3,
                    borderRadius: '2px',
                  }}
                ></div>
                <span>All Completed</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'orange',
                    opacity: 0.3,
                    borderRadius: '2px',
                  }}
                ></div>
                <span>Partial</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'red',
                    opacity: 0.3,
                    borderRadius: '2px',
                  }}
                ></div>
                <span>Some Missed</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'gray',
                    opacity: 0.3,
                    borderRadius: '2px',
                  }}
                ></div>
                <span>No Records</span>
              </div>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={habits}
          rowKey="id"
          loading={loading}
        />
      </div>
    </>
  );
};

export default HabitList;
