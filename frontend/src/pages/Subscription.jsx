import { useState } from 'react';
import { Button, Card, TextField, Typography, Snackbar, FormControl, InputLabel, Select, MenuItem, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bKash from '../assets/imgs/bkash.webp';
import Nagad from '../assets/imgs/nagad.png';
import Rocket from '../assets/imgs/rocket.png';
import Upay from '../assets/imgs/upay.png';
import styles from './styles/Login.module.css';

const Subscription = () => {
  const navigate = useNavigate();
  
  const packages = [
    {
      time: '১ মাস',
      money: '২৯৯৳',
      name: '1 month 299TK',
      duration: 30
    },
    {
      time: '৩ মাস',
      money: '৪৯৯৳',
      name: '3 month 499TK',
      duration: 90
    },
    {
      time: '৬ মাস',
      money: '৭৯৯৳',
      name: '6 month 799TK',
      duration: 180
    },
    {
      time: '১ বছর',
      money: '১২৯৯৳',
      name: '1 year 1299TK',
      duration: 365
    }
  ]
  const [packageIndex, setPackageIndex] = useState(0);

  const paymentMethods = [
    // {
    //   name: 'bKash',
    //   nameBn: 'বিকাশ',
    //   img: bKash,
    // },
    {
      name: 'Nagad',
      nameBn: 'নগদ',
      img: Nagad,
    },

    {
      name: 'Rocket',
      nameBn: 'রকেট',
      img: Rocket,
    },
    // {
    //   name: 'Upay',
    //   nameBn: 'উপায়',
    //   img: Upay,
    // }
  ];

  const [paymentMethod, setPaymentMethod] = useState({
    name: 'bKash',
    nameBn: 'বিকাশ',
    img: bKash,
  });

  const [dialog, setDialog] = useState(false);

  const [user, setUser] = useState({
    ...(JSON.parse(window.localStorage.getItem('user') || '{}')),
    packageName: packages[packageIndex].name,
    paymentMethod: paymentMethod.name,
    transactionId: '',
    status: 'pending',
    expiration: packages[packageIndex].duration
  });

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const submit = async () => {
    if (user.transactionId.trim() === '') {
      setError('Please enter ' + paymentMethod.name + ' transaction id');
      return;
    }

    try {
      setLoading(true);
      console.log("ok");
      const response = await axios.post('https://uflix.info/server/api/user/subscription', {
        ...user,
        packageName: packages[packageIndex].name,
        paymentMethod: paymentMethod.name,
        expiration: packages[packageIndex].duration
      });
      console.log(response);
      setLoading(false);
      
      window.localStorage.setItem('user', JSON.stringify(response.data))
      navigate('../' + response.data.status);
    } catch (error) {
      setLoading(false);
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <div className={styles.container}>
      <Card elevation={8} className={styles.card}>
        <div className={styles.header}>Subscriptions</div>
        <div style={{ fontSize: '14px', padding: '16px', textAlign: 'center' }}>
          সীমিত সময় এর জন্য কম্বো প্যাকেজ এর প্রাইজ <strong>অ্যান্ড্রয়েড</strong> ভার্সন এর জন্য
        </div>
        <div style={{ padding: '0px 16px 16px' }}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="select-label">Select package</InputLabel>
            <Select
              id='select-label'
              labelId="select-label"
              value={packageIndex}
              onChange={(event) => setPackageIndex(event.target.value)}
            >
              {packages.map((item, index) => (<MenuItem value={index} key={item.name}>{item.time + ' ' + item.money}</MenuItem>))}
            </Select>
          </FormControl>
        </div>
        <div style={{ fontSize: '14px', padding: '0px 16px 5px' }}>
          প্যাকেজ টি {packages[packageIndex].time} এর জন্যে নিতে আমাদের <a href="tel:01745683294">01745683294</a> নম্বরে <strong>নিচের যেকোন মাধ্যমে</strong> {packages[packageIndex].money} "Send Money" করুন <br /><br /> Send Money করার পর নিচের মাধ্যম টি সিলেক্ট করে Transaction ID ভেরিফাই করুন
        </div>
        <div style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {paymentMethods.map((item) => (
            <Paper onClick={() => {
              setUser({ ...user, transactionId: '' })
              setPaymentMethod(item);
              if(window.App){
                window.onBackPressed = () => {
                  setDialog(false);
                  window.onBackPressed = undefined;
                }
              }
              setDialog(true);
            }}
              elevation={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', margin: '5px', padding: '0px' }} key={item.name}>
              <img style={{ width: '60px', height: '60px', borderRadius: '10px', }} src={item.img} />
            </Paper>
          )
          )}
        </div>
        <div style={{ fontSize: '14px', padding: '0px 16px 5px', textAlign: 'center' }}>
          বি:দ্র: ১ বছর এর প্যাকেজ টি নিলে <strong>Youtube Premium, MX Player Pro and ChatGPT 4 Premium</strong> দেওয়া হবে, স্টক সীমিত!
        </div>
      </Card>
      <Dialog
        open={dialog}
        onClose={() => {
          setDialog(false)
        }}>
        <DialogTitle>
          {paymentMethod.name + ' payment'}
        </DialogTitle>
        <DialogContent>
          <div style={{ fontSize: '15px', padding: '0px 16px 5px' }}>
            প্যাকেজ টি {packages[packageIndex].time} এর জন্যে নিতে আমাদের <a href="tel:01745683294">01745683294</a> নম্বরে <strong>{paymentMethod.nameBn}</strong> এর মাধ্যমে {packages[packageIndex].money}&nbsp;"Send Money" করুন <br /><br /> Send Money করার পর নিচে Transaction ID দিয়ে SUBMIT বার্টুনে ক্লিক করুন
          </div>
          <div style={{ width: '100%', padding: '0px 16px 5px' }}>
            <TextField
              label={paymentMethod.name + " transaction id"}
              variant="filled"
              type="text"
              style={{ width: '100%' }}
              value={user.transactionId}
              onChange={(event) => {
                setError('')
                setUser({ ...user, transactionId: event.target.value })
              }}
              error={error ? true : false}
              helperText={error}
            />
          </div>
          <div style={{ padding: '16px 16px 5px', textAlign: 'center' }}>
            <LoadingButton
              loading={isLoading}
              onClick={() => submit()}
              variant="contained"
              color="primary"
              style={isLoading ? { background: '#1565C0' } : {}}
            >
              SUBMIT
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Subscription;