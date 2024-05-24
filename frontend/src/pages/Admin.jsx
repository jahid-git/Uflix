import { Button } from '@mui/material'
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {

  const navigate = useNavigate();

  const user = JSON.parse(window.localStorage.getItem('user') || '{}')

  useEffect(() => {

    if (user.password && user.phone) {
      user.isLogin = 1;
      axios.post('https://uflix.info/server/api/user/login', user).then((response) => {
        if (response.data.status != 'admin') {
          const resUser = response.data;
          window.localStorage.setItem('user', JSON.stringify(resUser));
          setUserState(resUser);
          navigate('/' + resUser.status, { replace: true });
        }
      })
    }
  }, [])
  return (
    <div style={{ height: '100vh', display: 'flex', width: '100%', textAlign: 'center', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>অনুগ্রহ করে Admin এর সাথে যোগাযোগ করুন</h2>
      <br />
      <Button variant="contained" color="primary" onClick={() => {
        window.App.openWhatsapp("+8801634272319", "Name: " + user.fullName + "\nPhone: " + user.phone + "\n\nHello!");
      }}>Admin Whatsapp</Button>
    </div>
  )
}

export default Admin