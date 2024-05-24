import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const Expiry = () => {

  const navigate = useNavigate();

  const user = JSON.parse(window.localStorage.getItem('user') || '{}')

  return (
    <div style={{ height: '100vh', display: 'flex', width: '100%', textAlign: 'center', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>আপনার সাবস্ক্রিপশনের মেয়াদ শেষ। নতুন করে সাবস্ক্রাইব করুন!</h2>
      <br/>
      <Button variant="contained" color="primary" onClick={()=>{
        navigate('/subscription', { replace: true });
      }}>Subscription</Button>
      <br/>
      <Button variant="contained" color="primary" onClick={()=>{
        window.App.openWhatsapp("+8801634272319", "Name: " + user.fullName + "\nPhone: " + user.phone + "\n\nHello Admin!\nআমার সাবস্ক্রিশনের মেয়াদ শেষ, নতুন করে সেবাটি চালু করতে চাই")
      }}>Admin Whatsapp</Button>
    </div>
  )
}

export default Expiry