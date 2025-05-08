import React, { useState, useEffect } from 'react';
import { Space, Table,Tag,message, Input, Button, Form } from 'antd';
import axios from 'axios';
import { Modal } from 'antd';
const { Column } = Table;

const App = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/student/get-students')
      .then((response) => {
        const dataWithKeys = response.data.map((item, index) => ({
          key: index,
          ...item,
        }));
        setStudents(dataWithKeys);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const showModal = (record) => {
    setEditStudent({ ...record }); // Create a copy for editing
    setIsModalVisible(true);
  };

  const handleChange = (key, value) => {
    setEditStudent((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Sending the updated student data to the backend
    console.log("Sending update for student:", editStudent);
    if(editStudent.id){
    axios
      .put(`http://localhost:8000/api/student/updateStudent/${editStudent.id}`, editStudent)
      .then((response) => {
        // Successfully updated student on the backend
        const updatedStudent = response.data.updatedStudent;
  
        // Update the local state to reflect the changes in the table
        const updated = students.map((s) =>
          s.key === editStudent.key ? updatedStudent : s
        );
        setStudents(updated);
  
        // Close the modal
        setIsModalVisible(false);
        setEditStudent(null);
        message.success('Student updated successfully!');
      })
      .catch((err) => {
        // Handle any errors that may occur during the update process
        message.error('Failed to update student');
        console.error(err);
      });}
      else{
        axios
      .post('http://localhost:8000/api/student/add-student', {
        InstName: editStudent.instid,
        StdName: editStudent.name_,
        Field_of_Interest: editStudent.field_of_interest,
        DoB: editStudent.dob,
        City: editStudent.city,
        Email: editStudent.email,
        ContactNo: editStudent.contactno
      })
      .then((res) => {
        const newRow = { 
          key: students.length,        // or use res.data.id
          ...res.data 
        };
        setStudents(prev => [...prev, newRow]);
        message.success('Student added successfully!');
        setIsModalVisible(false);
        setEditStudent(null);
      })
      .catch((err) => {
        message.error('Failed to add student');
        console.error(err);
      });
      }
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditStudent(null);
  };

  const handleDelete = (id) => {
    console.log("Delete clicked for id: ", id); // Log to check if the function is triggered
    Modal.confirm({
      title: 'Are you sure you want to delete this student?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        console.log('Deleting student with id:', id); // Log when the 'OK' button is pressed
        axios
          .delete(`http://localhost:8000/api/student/remove-student/${id}`)
          .then(() => {
            setStudents((prev) => prev.filter((student) => student.id !== id));
          })
          .catch((err) => {
            Modal.error({
              title: 'Delete failed',
              content: err.message,
            });
          });
      },
    });
  };

  
  
  
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Table
        dataSource={students}
        loading={loading}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => showModal(record),
        })}
        rowClassName="clickable-row"
      >
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Name" dataIndex="name_" key="name_" />
        <Column title="Field of Interest" dataIndex="field_of_interest" key="field_of_interest" />
        <Column title="Date of Birth" dataIndex="dob" key="dob" />
        <Column title="City" dataIndex="city" key="city" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Contact" dataIndex="contactno" key="contactno" />
        <Column title="Institution ID" dataIndex="instid" key="instid" />
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
        title="Edit Student"
        visible={isModalVisible}
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
        
        {editStudent && (
          <Form layout="vertical">
            <Form.Item label="ID">
              <Input value={editStudent.id} disabled />
            </Form.Item>
            <Form.Item label="Name">
              <Input
                value={editStudent.name_}
                onChange={(e) => handleChange('name_', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Field of Interest">
              <Input
                value={editStudent.field_of_interest}
                onChange={(e) => handleChange('field_of_interest', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Date of Birth">
              <Input
                value={editStudent.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="City">
              <Input
                value={editStudent.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Email">
              <Input
                value={editStudent.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Contact">
              <Input
                value={editStudent.contactno}
                onChange={(e) => handleChange('contactno', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Institution ID">
              <Input
                value={editStudent.instid}
                onChange={(e) => handleChange('instid', e.target.value)}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
            setEditStudent({   // empty template for a new student
            name_: '',
            field_of_interest: '',
            dob: '',
            city: '',
            email: '',
            contactno: '',
            instid: ''
            });
            setIsModalVisible(true);
        }}
        >
        Add Student
        </Button>
    </>
  );
};

export default App;
