import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message as antMessage } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HabitDurationEnum, habitService } from '../services/habitService';
import { categoryService, Category } from '../services/categoryService';
import React from 'react';

const { Option } = Select;

const HabitCreate = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const [message, contextHolder] = antMessage.useMessage();

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch categories';
      message.error(errorMessage);
    }
  };

  const onFinish = async (values: {
    name: string;
    description?: string;
    duration: HabitDurationEnum;
    startDate: Date;
    endDate: Date;
  }) => {
    setLoading(true);
    try {
      await habitService.create(values);
      message.success('Habit created successfully');
      navigate('/habits');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create habit';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {contextHolder}
      <div>
        <h2>Create Habit</h2>
        <Form
          name="habitCreate"
          onFinish={onFinish}
          layout="vertical"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input the habit name!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: 'Please select the duration!' }]}
          >
            <Select placeholder="Select duration">
              <Option value="DAILY">Daily</Option>
              <Option value="WEAKLY">Weekly</Option>
              <Option value="MONTHLY">Monthly</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default HabitCreate;
