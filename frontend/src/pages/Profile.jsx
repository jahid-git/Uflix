import { useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader } from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios';
import styles from './styles/Profile.module.css';

const Profile = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user') || '{}'))

    useEffect(() => {
        if (user.password && user.phone) {
            user.isLogin = 1;
            axios.post('https://uflix.info/server/api/user/login', user).then((response) => {
                if (response.data) {
                    const resUser = response.data;
                    window.localStorage.setItem('user', JSON.stringify(resUser));
                    if (resUser.expiration) {
                        resUser.expiration = (parseInt(resUser.expiration + '') - getDayDifference(resUser.startedAt));
                        resUser.expiration = resUser.expiration < 0 ? 'expired' : dayOrDays(resUser.expiration);
                    }
                    setUser(resUser);
                } 
            }).catch((error) => {
                //navigate('/login', { replace: true })
            });
        } else {
            //navigate('/login', { replace: true })
        }
    }, [])

    const logout = async () => {
        try {
            const response = await axios.post('https://uflix.info/server/api/user/logout', user)
            if (response.data) {
                window.localStorage.setItem('user', '{}')
                navigate('/login', { replace: true })
                window.App.showToast(response.data.message)
            }
        } catch (error) {
            window.App.showToast(error.message)
        }
    }

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

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {user.phone && <>
                <Card sx={{ padding: '10px' }} className={styles.profileCard} elevation={8}>

                    <p>
                        <b>Name: </b>{user.fullName}
                    </p>
                    <p>
                        <b>Email: </b>{user.email}
                    </p>
                    <p>
                        <b>Phone: </b>{user.phone}
                    </p>
                    <p>
                        <b>Status: </b>{user.status.replace('subscription', 'inactive')}
                    </p>
                    <p>
                        {
                            user.expiration && <>
                                <b>Expiration: </b>{user.expiration}
                            </>
                        }
                        {
                            !user.expiration && <>
                                <b>Expiration: </b>invalid
                            </>
                        }
                    </p>
                </Card>
            </>}

            <br />
            <Button variant="contained" color="primary" onClick={() => {
                if (user.phone) {
                    logout()
                } else {
                    navigate('/login', { replace: true })
                }
            }}>{user.phone && <>Logout</>} {!user.phone && <>Login</>}</Button>
            <br />

            {
                user.email === 'admin@gmail.com' ? (<Button variant="contained" color="primary" onClick={() => { navigate('/admin_panel') }}>Admin Panel</Button>) : (<Button variant="contained" color="primary" onClick={() => { window.App.openWhatsapp("+8801634272319", "Name: " + user.fullName + "\nPhone: " + user.phone + "\n\nHello Admin!\nআমার প্যাকেজের মেয়াদ বাড়িয়ে দিন") }}>Admin Whatsapp</Button>) 
            }

        </div>
    )
}

export default Profile