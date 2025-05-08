import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Space, Table, Modal, message, Button, Form, Select, Input, Tag } from 'antd';
import { Flex } from 'antd';
import moment from 'moment';

const { Column } = Table;
const { Option } = Select;

const App = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modelVisible, setModalVisible] = useState(false);
  const [editInternship, setEditInternship] = useState(null);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/student/search-internshipByField')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.internships || [];
        const dataWithKeys = data.map((p, i) => ({ key: i, ...p }));
        setInternships(dataWithKeys);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const showModal = (record) => {
    setEditInternship({ ...record });
    setModalVisible(true);
  };

  const handleChange = (key, value) => {
    setEditInternship((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Check if dates are valid and convert if necessary
    if (editInternship.startdate && editInternship.enddate) {
      editInternship.startdate = moment(editInternship.startdate).format('YYYY-MM-DD');
      editInternship.enddate = moment(editInternship.enddate).format('YYYY-MM-DD');
    } else {
      message.error("Please provide valid start and end dates.");
      return;
    }
  
    // Check if the 'id' exists and is valid for update
    if (editInternship.id) {
      axios.put(`http://localhost:8000/api/student/update-internship-application/${editInternship.id}`, editInternship)
        .then((res) => {
          const updated = internships.map((p) =>
            p.id === editInternship.id ? { ...res.data.updatedInternship, key: p.key } : p
          );
          setInternships(updated);
          message.success('Internship application updated');
          setModalVisible(false);
          setEditInternship(null);
        })
        .catch((err) => {
          message.error('Failed to update application');
          console.error(err);
        });
    } else {
      axios.post('http://localhost:8000/api/student/apply-internship', editInternship)
        .then((res) => {
          setInternships((prev) => [...prev, { ...res.data, key: prev.length }]);
          message.success('Internship application submitted');
          setModalVisible(false);
          setEditInternship(null);
        })
        .catch((err) => {
          message.error('Failed to apply for internship');
          console.error(err);
        });
    }
  };
  
  

  const handleCancel = () => {
    setModalVisible(false);
    setEditInternship(null);
  };

  const convertDateFormat = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };
  

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this application?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        axios.delete(`http://localhost:8000/api/student/delete-internship/${id}`)
          .then(() => {
            setInternships((prev) => prev.filter((i) => i.id !== id));
            message.success('Internship application deleted');
          })
          .catch((err) => {
            Modal.error({
              title: 'Delete failed',
              content: err.message,
            });
          });
      }
    });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Flex vertical style={{ padding: 10, background: '#fff', borderRadius: 8 }}>
        <h2 style={{ marginBottom: 30 }}>Internship Applications</h2>
        <Select
          style={{ width: 200, marginBottom: 16 }}
          placeholder="Filter by Status"
          value={searchText}
          onChange={(val) => setSearchText(val)}
        >
          <Option value="">None</Option>
          <Option value="Processing">Pending</Option>
          <Option value="Accepted">Approved</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>

        <Table
          dataSource={internships.filter((item) =>
            searchText ? item.status_?.toLowerCase() === searchText.toLowerCase() : true
          )}
          loading={loading}
          onRow={(record) => ({
            onClick: () => showModal(record),
          })}
          scroll={{ x: 'max-content' }}
          rowClassName="clickable-row"
        >
          <Column title="ID" dataIndex="id" key="id" />
          <Column
            title="Status"
            dataIndex="status_"
            key="status_"
            render={(status) => (
              <Tag color={
                status === 'Accepted' ? 'green' :
                status === 'Rejected' ? 'red' :
                'gold'
              }>
                {status}
              </Tag>
            )}
          />
          <Column title="Applied Date" dataIndex="applieddate" key="applieddate" />
          <Column title="Student ID" dataIndex="stdid" key="stdid" />
          <Column title="Internship ID" dataIndex="intshpid" key="intshpid" />
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

        <Button
          type="primary"
          style={{ marginTop: 24 }}
          onClick={() => {
            setEditInternship({
              name_: '',
              field: '',
              city: '',
              email: '',
              type_: '',
            });
            setModalVisible(true);
          }}
        >
          Apply for Internship
        </Button>
      </Flex>

      <Modal
        title={editInternship?.id ? "Edit Internship" : "Apply for Internship"}
        open={modelVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        {editInternship && (
          <Form layout="vertical">
            {editInternship.id && (
              <Form.Item label="ID">
                <Input value={editInternship.id} disabled />
              </Form.Item>
            )}
            <Form.Item label="Status">
              <Select value={editInternship.status_} onChange={(val) => handleChange('status_', val)}>
                              <Option value="Accepted">Accepted</Option>
                              <Option value="Rejected">Rejected</Option>
                              <Option value="Processing">Processing</Option>
                              
                            </Select>
            </Form.Item>
            <Form.Item label="Application Date">
                <Input
                    type="date"
                    value={editInternship.applieddate}
                    onChange={(e) => handleChange('applieddate', e.target.value)}
                />
                </Form.Item>

                <Form.Item label="Student ID">
                <Input
                    value={editInternship.stdid}
                    onChange={(e) => handleChange('stdid', e.target.value)}
                />
                </Form.Item>

                <Form.Item label="Internship ID">
                <Input
                    value={editInternship.intshpid}
                    onChange={(e) => handleChange('intshpid', e.target.value)}  // fixed typo from 'eintshpid'
                />
                </Form.Item>

                <Form.Item label="Start Date">
                <Input
                    type="date"
                    value={editInternship.startdate}
                    onChange={(e) => handleChange('startdate', e.target.value)}  // match backend
                />
                </Form.Item>

                <Form.Item label="End Date">
                <Input
                    type="date"
                    value={editInternship.enddate}
                    onChange={(e) => handleChange('enddate', e.target.value)}  // match backend
                />
                </Form.Item>


          </Form>
        )}
      </Modal>
    </>
  );
};

export default App;
