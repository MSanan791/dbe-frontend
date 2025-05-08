import React, { useState, useEffect } from 'react';
import { Space, Table, message, Input, Button, Form, Modal, Select } from 'antd';
import axios from 'axios';

const { Column } = Table;
const { Option } = Select;

const ProviderTable = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editProvider, setEditProvider] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/provider/get-providers')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.providers || [];
        const dataWithKeys = data.map((p, i) => ({ key: i, ...p }));
        setProviders(dataWithKeys);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const showModal = (record) => {
    setEditProvider({ ...record });
    setIsModalVisible(true);
  };

  const handleChange = (key, value) => {
    setEditProvider((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (editProvider.id) {
      axios.put(`http://localhost:8000/api/provider/update-provider/${editProvider.id}`, editProvider)
        .then((res) => {
          const updated = providers.map((p) =>
            p.id === editProvider.id ? { ...res.data.updatedProvider, key: p.key } : p
          );
          setProviders(updated);
          message.success('Provider updated');
          setIsModalVisible(false);
          setEditProvider(null);
        })
        .catch((err) => {
          message.error('Failed to update provider');
          console.error(err);
        });
    } else {
      axios.post('http://localhost:8000/api/provider/add-provider', editProvider)
        .then((res) => {
          setProviders((prev) => [...prev, { ...res.data, key: prev.length }]);
          message.success('Provider added');
          setIsModalVisible(false);
          setEditProvider(null);
        })
        .catch((err) => {
          message.error('Failed to add provider');
          console.error(err);
        });
    }
  };

  const handleDelete = (id) => {
    console.log(id); // Add this line to check if the id is correct
    Modal.confirm({
        title: 'Are you sure you want to delete this provider?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
            // Ensure the correct id is used in the URL
            axios.delete(`http://localhost:8000/api/provider/remove-provider/${id}`)
                .then(() => {
                    setProviders((prev) => prev.filter((p) => p.id !== id));
                    message.success('Provider deleted');
                })
                .catch((err) => {
                    message.error('Failed to delete provider');
                    console.error(err);
                });
        }
    });
};

  

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditProvider(null);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Table
        dataSource={providers}
        loading={loading}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => showModal(record),
        })}
        rowClassName="clickable-row"
      >
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Name" dataIndex="name_" key="name_" />
        <Column title="Type" dataIndex="type_" key="type_" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Website" dataIndex="website" key="website" />
        <Column title="Field" dataIndex="field" key="field" />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(record.id);
                }}
              >
                Delete
              </a>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editProvider?.ID ? 'Edit Provider' : 'Add Provider'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
          <Button key="save" type="primary" onClick={handleSave}>Save</Button>
        ]}
      >
        {editProvider && (
          <Form layout="vertical">
            <Form.Item label="Type">
              <Select value={editProvider.type_} onChange={(val) => handleChange('type_', val)}>
                <Option value="Company">Company</Option>
                <Option value="Lab">Lab</Option>
                <Option value="Professor">Professor</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Name">
              <Input value={editProvider.name_} onChange={(e) => handleChange('name_', e.target.value)} />
            </Form.Item>
            <Form.Item label="Email">
              <Input value={editProvider.email} onChange={(e) => handleChange('email', e.target.value)} />
            </Form.Item>
            <Form.Item label="Website">
              <Input value={editProvider.website} onChange={(e) => handleChange('website', e.target.value)} />
            </Form.Item>
            <Form.Item label="Field">
              <Input value={editProvider.field} onChange={(e) => handleChange('field', e.target.value)} />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Button
        type="primary"
        style={{ marginTop: 16 }}
        onClick={() => {
          setEditProvider({
            Type_: 'Company',
            Name_: '',
            Email: '',
            Website: '',
            Field: ''
          });
          setIsModalVisible(true);
        }}
      >
        Add Provider
      </Button>
    </>
  );
};

export default ProviderTable;
