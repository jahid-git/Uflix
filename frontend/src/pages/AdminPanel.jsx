import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { Button } from '@mui/material';

import styles from './styles/AdminPanel.module.css';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {

  const navigate = useNavigate()

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const [allSMS, setSMS] = useState(window.App ? JSON.parse(window.App.getAllSMS() || '[]') : [])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post('https://uflix.info/server/api/user/all', {
          phone: '017123456789',
          password: 'admin'
        });

        const pendingUsers = response.data.filter((user) => user.status === 'pending')
        pendingUsers.forEach(user => {
          
          try {
            allSMS[user.paymentMethod.toLowerCase()].forEach(async msg => {
              if (msg.messageBody.lastIndexOf(user.transactionId) > 0 && msg.messageBody.lastIndexOf(user.package.split(' ')[2].replace('TK', '')) > 0) {
                try {
                  const response = await axios.post('https://uflix.info/server/api/user/update', {
                    ...user,
                    status: 'active'
                  });
                  window.App.showToast('Refresh sucessful!')
                } catch (e) {
                  window.App.showToast(e.message)
                }
              }
            })
          } catch (e) {

          }

        });

        setUsers(response.data.map((user) => ({
          ...user,
          time: dayOrDays(parseInt(user.expiration) - getDayDifference(user.startedAt))
        })));

        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();



  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      filterUsers();
      setIsTyping(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, users]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setIsTyping(true);
  };

  const filterUsers = () => {
    const filteredUsers = users.filter(user =>
      searchTerm.startsWith("#") ? user.status.toLowerCase().includes(searchTerm.substring(1).toLowerCase()) : user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
  };

  const getDayDifference = (dateString) => {
    const currentDate = new Date();
    const givenDate = new Date(dateString);
    const currentDateMs = currentDate.getTime();
    const givenDateMs = givenDate.getTime();
    const differenceMs = currentDateMs - givenDateMs;
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    return differenceDays;
  }

  const dayOrDays = days => {
    return days <= 1 ? days + ' day' : days + ' days'
  }

  const handleUserClick = (user) => {
    window.localStorage.setItem('show_user', JSON.stringify(user))
    navigate('../show_user')
  };

  return (
    <div className={styles.container}>
      <Toolbar>
        <TextField
          label={"Search users (" + (users.length) + ")"}
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Toolbar>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ width: '100%', backgroundColor: '#ffffff' }}>
          {isTyping ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>Stop typing to search...</div>
          ) : (
            <div className={styles.listContainer}>
              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  {users.length === 0 ? "Fetching users..." : "No users found."}
                </div>
              ) : (
                <List component="nav" aria-label="user list">
                  {filteredUsers.map((user, index) => (
                    <div key={index}>
                      <ListItem button onClick={() => handleUserClick(user)}> {/* Call handleUserClick when clicked */}
                        <div className={styles.item}>
                          <div className={styles.num}>
                            {(index + 1) + ')'}
                          </div>
                          <div className={styles.left}>
                            <b>{user.fullName}</b>
                            <span>{user.time}</span>
                          </div>
                          <div className={styles.right}>
                            {user.status}
                          </div>
                        </div>
                      </ListItem>
                      {index !== filteredUsers.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
