import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message as antMessage,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { categoryService, Category } from '../services/categoryService';
import React from 'react';

const { Option } = Select;

const TaskCreate = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, contextHolder] = antMessage.useMessage();

  const navigate = useNavigate();

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
    title: string;
    description?: string;
    dueDate: string;
    categoryId: number;
  }) => {
    setLoading(true);
    try {
      await taskService.create(values);
      message.success('Task created successfully');
      navigate('/tasks');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create task';
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
        <h2>Create Task</h2>
        <Form
          name="taskCreate"
          onFinish={onFinish}
          layout="vertical"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please input the task title!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Due Date" name="dueDate">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Category" name="categoryId">
            <Select placeholder="Select category" allowClear>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
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

export default TaskCreate;
