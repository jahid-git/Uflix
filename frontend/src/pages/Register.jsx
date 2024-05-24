import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, TextField, Snackbar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import styles from './styles/Register.module.css';

const Register = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        deviceId: 'Id:' + (new Date().getTime()),
    });

    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const user = JSON.parse(window.localStorage.getItem('user') || '{}')
        if (user.status) {
            navigate('../' + user.status, { replace: true })
        }
    }, []);

    const handleChange = (event, field) => {
        setUser({ ...user, [field]: event.target.value });
        setErrors({});
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const register = async () => {
        const newErrors = {};
        if (user.fullName === '') newErrors.fullName = 'Full name is required.';
        if (user.email === '') newErrors.email = 'Email is required.';
        if (user.phone === '') newErrors.phone = 'Phone number is required.';
        if (user.password === '') newErrors.password = 'Password is required.';
        if (user.confirmPassword === '') newErrors.confirmPassword = 'Confirm password is required.';
        if (user.password !== user.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setLoading(true);
        try {
            const reqUser = JSON.parse(JSON.stringify(user));
            delete reqUser.confirmPassword;
            const response = await axios.post("https://uflix.info/server/api/user/register", reqUser);
            if (response.data) {
                const resUser = response.data;
                window.localStorage.setItem('user', JSON.stringify(resUser));

                setServerMessage('Registraion sucessful');
                setOpenSnackbar(true);
                navigate('../' + resUser.status, { replace: true });
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            setServerMessage(error.response.data.message);
            setOpenSnackbar(true);
        }
    };

    return (
        <div className={styles.container}>
            <Card elevation={8} className={styles.card}>
                <div className={styles.header}>Register</div>
                <div className={styles.inputFieldWrapper}>
                    <TextField
                        label="Full name"
                        variant="filled"
                        type="text"
                        value={user.fullName}
                        onChange={(event) => handleChange(event, 'fullName')}
                        className={styles.inputField}
                    />
                    {errors.fullName && <div className={styles.error}>{errors.fullName}</div>}
                </div>
                <div className={styles.inputFieldWrapper}>
                    <TextField
                        label="Email address"
                        variant="filled"
                        type="email"
                        value={user.email}
                        onChange={(event) => handleChange(event, 'email')}
                        className={styles.inputField}
                    />
                    {errors.email && <div className={styles.error}>{errors.email}</div>}
                </div>
                <div className={styles.inputFieldWrapper}>
                    <TextField
                        label="Phone number"
                        variant="filled"
                        type="tel"
                        value={user.phone}
                        onChange={(event) => handleChange(event, 'phone')}
                        className={styles.inputField}
                    />
                    {errors.phone && <div className={styles.error}>{errors.phone}</div>}
                </div>
                <div className={styles.inputFieldWrapper}>
                    <TextField
                        label="Password"
                        variant="filled"
                        type="password"
                        value={user.password}
                        onChange={(event) => handleChange(event, 'password')}
                        className={styles.inputField}
                    />
                    {errors.password && <div className={styles.error}>{errors.password}</div>}
                </div>
                <div className={styles.inputFieldWrapper}>
                    <TextField
                        label="Confirm password"
                        variant="filled"
                        type="password"
                        value={user.confirmPassword}
                        onChange={(event) => handleChange(event, 'confirmPassword')}
                        className={styles.inputField}
                    />
                    {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword}</div>}
                </div>
                <div className={styles.inputFieldWrapper}>
                    <LoadingButton loading={isLoading} onClick={() => register()} variant="contained" color="primary" style={isLoading ? { background: '#1565C0' } : {}}>Register</LoadingButton>
                </div>
            </Card>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                message={serverMessage}
                color='primary'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </div>
    );
};

export default Register;