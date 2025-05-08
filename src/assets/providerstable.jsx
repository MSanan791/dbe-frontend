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

  const [filteredData, setFilteredData] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:8000/api/provider/get-providers')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.providers || [];
        const dataWithKeys = data.map((p, i) => ({ key: i, ...p }));
        setProviders(dataWithKeys);
        setFilteredData(dataWithKeys); // Set filtered data initially to all data
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
          setFilteredData(updated); // Update filtered data as well
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
          setFilteredData((prev) => [...prev, { ...res.data, key: prev.length }]); // Add to filtered data as well
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
    console.log(id);
    Modal.confirm({
        title: 'Are you sure you want to delete this provider?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
            axios.delete(`http://localhost:8000/api/provider/remove-provider/${id}`)
                .then(() => {
                    setProviders((prev) => prev.filter((p) => p.id !== id));
                    setFilteredData((prev) => prev.filter((p) => p.id !== id)); // Update filtered data as well
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

  const handleFilterChange = (value, key) => {
    const filtered = providers.filter((provider) =>
      provider[key].toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <h2>Providers</h2>
      <Table
        dataSource={filteredData}
        loading={loading}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => showModal(record),
        })}
        rowClassName="clickable-row"
      >
        <Column
          title="ID"
          dataIndex="id"
          key="id"
          filterDropdown={({ setSelectedKeys, selectedKeys, confirm }) => (
            <div>
              <Input
                placeholder="Search ID"
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys([e.target.value])}
                onPressEnter={() => confirm()}
                style={{ marginBottom: 8, display: 'block' }}
              />
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Search
              </Button>
              <Button onClick={() => setSelectedKeys([])} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </div>
          )}
          onFilter={(value, record) => record.id.toString().includes(value)}
        />
        <Column
          title="Name"
          dataIndex="name_"
          key="name_"
          filterDropdown={({ setSelectedKeys, selectedKeys, confirm }) => (
            <div>
              <Input
                placeholder="Search Name"
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys([e.target.value]);
                  handleFilterChange(e.target.value, 'name_');
                }}
                onPressEnter={() => confirm()}
                style={{ marginBottom: 8, display: 'block' }}
              />
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Search
              </Button>
              <Button onClick={() => setSelectedKeys([])} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </div>
          )}
          onFilter={(value, record) => record.name_.toLowerCase().includes(value.toLowerCase())}
        />
        <Column
          title="Type"
          dataIndex="type_"
          key="type_"
          filterDropdown={({ setSelectedKeys, selectedKeys, confirm }) => (
            <div>
              <Input
                placeholder="Search Type"
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys([e.target.value]);
                  handleFilterChange(e.target.value, 'type_');
                }}
                onPressEnter={() => confirm()}
                style={{ marginBottom: 8, display: 'block' }}
              />
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Search
              </Button>
              <Button onClick={() => setSelectedKeys([])} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </div>
          )}
          onFilter={(value, record) => record.type_.toLowerCase().includes(value.toLowerCase())}
        />
        <Column
          title="Email"
          dataIndex="email"
          key="email"
          filterDropdown={({ setSelectedKeys, selectedKeys, confirm }) => (
            <div>
              <Input
                placeholder="Search Email"
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys([e.target.value]);
                  handleFilterChange(e.target.value, 'email');
                }}
                onPressEnter={() => confirm()}
                style={{ marginBottom: 8, display: 'block' }}
              />
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Search
              </Button>
              <Button onClick={() => setSelectedKeys([])} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </div>
          )}
          onFilter={(value, record) => record.email.toLowerCase().includes(value.toLowerCase())}
        />
        <Column
          title="Website"
          dataIndex="website"
          key="website"
          filterDropdown={({ setSelectedKeys, selectedKeys, confirm }) => (
            <div>
              <Input
                placeholder="Search Website"
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys([e.target.value]);
                  handleFilterChange(e.target.value, 'website');
                }}
                onPressEnter={() => confirm()}
                style={{ marginBottom: 8, display: 'block' }}
              />
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Search
              </Button>
              <Button onClick={() => setSelectedKeys([])} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </div>
          )}
          onFilter={(value, record) => record.website.toLowerCase().includes(value.toLowerCase())}
        />
        <Column
          title="Field"
          dataIndex="field"
          key="field"
          filterDropdown={({ setSelectedKeys, selectedKeys, confirm }) => (
            <div>
              <Input
                placeholder="Search Field"
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys([e.target.value]);
                  handleFilterChange(e.target.value, 'field');
                }}
                onPressEnter={() => confirm()}
                style={{ marginBottom: 8, display: 'block' }}
              />
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Search
              </Button>
              <Button onClick={() => setSelectedKeys([])} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </div>
          )}
          onFilter={(value, record) => record.field.toLowerCase().includes(value.toLowerCase())}
        />
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
