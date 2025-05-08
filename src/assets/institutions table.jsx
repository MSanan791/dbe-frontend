import React, {useState,useEffect, use } from 'react';
import axios from 'axios';
import { Space, Table, Tag, Modal, message ,Button, Form, Select,Input, Flex} from 'antd';


const { Column, ColumnGroup } = Table;




const App = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const[modelVisible, setModalVisible] = useState(false);
    const[editInstitution, setEditInstitution] = useState(null);
    const [searchField, setSearchField] = useState('');
    const [uniqueFields, setUniqueFields] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:8000/api/institution/get-institution')
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : res.data.institutions || [];
                const dataWithKeys = data.map((p, i) => ({ key: i, ...p }));
                setInstitutions(dataWithKeys);
                const uniqueFields = [...new Set(data.map(p => p.field).filter(Boolean))];
                setUniqueFields(uniqueFields);

                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    },[]);

    const showModal = (record) => {
        setEditInstitution({ ...record });
        setModalVisible(true);
    }

    const handleChange = (key, value) => {  
        setEditInstitution((prev) => ({ ...prev, [key]: value }));
    }
    const handleSave = () => {
        if (editInstitution.id) {
            axios.put(`http://localhost:8000/api/institution/update-institution/${editInstitution.id}`, editInstitution)
                .then((res) => {
                    const updated = institutions.map((p) =>
                        p.id === editInstitution.id ? { ...res.data.updatedInstitution, key: p.key } : p
                    );
                    setInstitutions(updated);
                    message.success('Provider updated');
                    setModalVisible(false);
                    setEditInstitution(null);
                })
                .catch((err) => {
                    message.error('Failed to update provider');
                    console.error(err);
                });
        } else {
            axios.post('http://localhost:8000/api/institution/add-institution', editInstitution)
                .then((res) => {
                    setInstitutions((prev) => [...prev, { ...res.data, key: prev.length }]);
                    message.success('Provider added');
                    setModalVisible(false);
                    setEditInstitution(null);
                })
                .catch((err) => {
                    message.error('Failed to add provider');
                    console.error(err);
                });
        }
    }
    const handleCancel = () => {
        setModalVisible(false);
        setEditInstitution(null);
    }

    const handleDelete = (id) => {
        console.log("Delete clicked for id: ", id);
        Modal.confirm({
            title: 'Are you sure you want to delete this Institution?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                console.log('Deleting Institution with id:', id);
                axios
                    .delete(`http://localhost:8000/api/institution/remove-institution/${id}`)
                    .then(() => {
                        setInstitutions((prev) =>
                            prev.filter((institution) => institution.id !== id)
                        );
                        message.success('Institution deleted successfully');
                    })
                    .catch((err) => {
                        Modal.error({
                            title: 'Delete failed',
                            content: err.message,
                        });
                    });
            }
        });
    }
    

    if (error)return(<div>Error: {error}</div>);
    
    return (
        <>
        <Flex vertical style={{ padding: 20, gap: 10 }}>
        <h2 style={{justifyContent:'left'}}>Institutions</h2>
        <Select
    style={{ width: 250 ,marginBottom: 16 }}
    placeholder="Filter by Area of Interest"
    allowClear
    value={searchField || undefined}
    onChange={(value) => setSearchField(value || '')}
  >
    <Select.Option value="">All</Select.Option>
{uniqueFields.map((field) => (
  <Select.Option key={field} value={field}>
    {field}
  </Select.Option>
))}

  </Select>
  <Table
  dataSource={institutions.filter(inst =>
    !searchField || inst.field === searchField
)}

loading={loading}
onRow={(record) => ({
    onClick: () => showModal(record),
})}

scroll={{ x: 'max-content' }}
rowClassName="clickable-row"
>
    <Column title="ID" dataIndex={"id"} key="id" />
      <Column title="Name" dataIndex="name_" key="name_" />
    <Column title="Area of Interest" dataIndex="field" key="field" />
    <Column title="City" dataIndex="city" key="city" />
    <Column title="Email" dataIndex="email" key="email" />
    
    <Column
        title="Type"
        dataIndex="type_"
        key="type_"
        render={type_ => {
            if (!type_) return null; // Or return a fallback tag like: <Tag>Unknown</Tag>
            
            let color = 'blue';
            switch (type_) {
                case 'University':
                    color = 'geekblue';
                    break;
                    case 'College':
                        color = 'green';
                        break;
                        default:
                            color = 'volcano';
                            break;
                        }
                        
                        return (
                            <Tag color={color} key={type_}>
                {type_.toUpperCase()}
            </Tag>
            );
        }}
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
  </Flex>
  <Modal
  title={editInstitution?.id ? "Edit Institution" : "Add Institution"}
  visible={modelVisible}
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
  {editInstitution && (
    <Form layout="vertical">
      <Form.Item label="ID">
        <Input value={editInstitution.id} disabled />
        
      </Form.Item>
      <Form.Item label="Institution Name">
        <Input
          value={editInstitution.name_}
          onChange={(e) => handleChange('name_', e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Area of Interest">
        <Input
          value={editInstitution.field}
          onChange={(e) => handleChange('field', e.target.value)}
        />
      </Form.Item>
      <Form.Item label="City">
        <Input
          value={editInstitution.city}
          onChange={(e) => handleChange('city', e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Email">
        <Input
          value={editInstitution.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Type">
      <Select value={editInstitution.type_} onChange={(val) => handleChange('type_', val)}>
                <Option value="University">University</Option>
                <Option value="College">College</Option>
                
              </Select>
      </Form.Item>
    </Form>
  )}
</Modal>

<div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
 

  <Button
    type="primary"
    onClick={() => {
      setEditInstitution({
        name_: '',
        field: '',
        city: '',
        email: '',
        type_: '',
      });
      setModalVisible(true);
    }}
  >
    Add Institution
  </Button>
</div>


  </>
)};
export default App;