import { Button } from '@mui/material'
import { useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Pending = () => {

  const navigate = useNavigate();
  const user = JSON.parse(window.localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (user.password && user.phone) {
      user.isLogin = 1;
      axios.post('https://uflix.info/server/api/user/login', user).then((response) => {
        if (response.data) {
          const resUser = response.data;
          window.localStorage.setItem('user', JSON.stringify(resUser));
          navigate('/' + resUser.status, { replace: true });
        } else {
          navigate('/admin', { replace: true });
        }
      }).catch((error) => {
        //navigate('/login', { replace: true })
      });
    } else {
      //navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div style={{ height: '100vh', display: 'flex', width: '100%', textAlign: 'center', padding: '10px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>কিছুক্ষণের মধ্যে আপনার অ্যাকাউন্ট Active হতে যাচ্ছে। অনুগ্রহপূর্বক অপেক্ষা করে সেবাটি চালু করতে আমাদের সহায়তা করুন!</h2>
      <br />
      <Button variant="contained" color="primary" onClick={() => {
        window.App.openWhatsapp("+8801634272319", "Name: " + user.fullName + "\nPhone: " + user.phone + "\n\nHello Admin!\nআমি পেমেন্ট করে Transaction ID পাঠিয়েছি, দয়াকরে চেক করুন!")
      }}>Admin Whatsapp</Button>
    </div>
  )
}

export default Pending