import { useEffect, useState } from 'react';
import { Button, Card, TextField, Typography, Snackbar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/Login.module.css';

const Login = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        phone: '',
        password: '',
    });

    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const user = JSON.parse(window.localStorage.getItem('user') || '{}')

        if (user.status) {
            navigate('../' + user.status, { replace: true })
        }

    }, []);

    const login = async () => {
        const newErrors = {};
        if (user.phone === '') newErrors.phone = 'Phone number is required.';
        if (user.password === '') newErrors.password = 'Password is required.';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            setLoading(true);
            user.isLogin = undefined;
            const response = await axios.post('https://uflix.info/server/api/user/login', user);
            setLoading(false);
            if (response.data) {
                const resUser = response.data;
                    window.localStorage.setItem('user', JSON.stringify(resUser));
                    setSnackbarMessage('Login sucessful');
                    setSnackbarOpen(true);
                    navigate('../' + resUser.status, { replace: true });
                    setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            if(error.response){
                setSnackbarMessage(error.response.data.message);
            } else {
                setSnackbarMessage(error.message);
            }
            setSnackbarOpen(true);
        }
    };

    return (
        <div className={styles.container}>
            <Card elevation={8} className={styles.card}>
                <div className={styles.header}>Login</div>
                <div className={styles.inputFieldWrapper}>
                    <TextField
                        label="Phone number"
                        variant="filled"
                        type="tel"
                        value={user.phone}
                        onChange={(event) => setUser({ ...user, phone: event.target.value })}
                        className={styles.inputField}
                        error={errors.phone ? true : false}
                        helperText={errors.phone}
                    />
                </div>
                <div className={styles.inputFieldWrapper}>
                    <TextField
                        label="Password"
                        variant="filled"
                        type="password"
                        value={user.password}
                        onChange={(event) => setUser({ ...user, password: event.target.value })}
                        className={styles.inputField}
                        error={errors.password ? true : false}
                        helperText={errors.password}
                    />
                </div>
                <div className={styles.forgotPassword}>
                    <Typography variant="body2">
                        <a href='https://uflix.info/server/#/admin'>Forgot password</a>
                    </Typography>
                </div>
                <div className={styles.inputFieldWrapper}>
                    <LoadingButton
                        loading={isLoading}
                        onClick={() => login()}
                        variant="contained"
                        color="primary"
                        style={isLoading ? { background: '#1565C0' } : {}}
                    >
                        Login
                    </LoadingButton>
                </div>
                <div className={styles.inputFieldWrapper}>
                    <Button variant="outlined" sx={{ width: '60%' }} onClick={() => navigate('../register')}>
                        Register
                    </Button>
                </div>
            </Card>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
};

export default Login;