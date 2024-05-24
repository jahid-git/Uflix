import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab';

import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import styles from './styles/Splash.module.css'
import SlideImage1 from '../assets/imgs/slide1.jpeg'
import SlideImage2 from '../assets/imgs/slide2.jpeg'
import SlideImage3 from '../assets/imgs/slide3.jpeg'
import SlideImage4 from '../assets/imgs/slide4.jpeg'

import axios from 'axios';

const Splash = () => {
    const navigate = useNavigate()

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (window.App) {
            window.App.startApp();
        }
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const getStart = async () => {
        const user = JSON.parse(window.localStorage.getItem('user') || '{}')
        if (user.password && user.phone) {
            try {
                setLoading(true);
                user.isLogin = 1;
                const response = await axios.post('https://uflix.info/server/api/user/login', user);
                setLoading(false);
                if (response.data) {
                    const resUser = response.data;
                    window.localStorage.setItem('user', JSON.stringify(resUser));
                    navigate('/' + resUser.status, { replace: true });
                } else {
                    window.localStorage.setItem('user', '{}');
                    navigate('/login', { replace: true })
                }
            } catch (error) {
                window.localStorage.setItem('user', '{}');
                navigate('/login', { replace: true })
            }
        } else {
            window.localStorage.setItem('user', '{}');
            navigate('/login', { replace: true })
        }
    }

    return (
        <div className={styles.container}>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={50}
                slidesPerView={1}
                navigation
                allowTouchMove
                pagination={{ clickable: true }}
            >
                <SwiperSlide>
                    <img src={SlideImage1} className={styles.slide} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={SlideImage2} className={styles.slide} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={SlideImage3} className={styles.slide} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={SlideImage4} className={styles.slide} />
                </SwiperSlide>
            </Swiper>
            <div className={styles.startBtnWrapper}>
                <LoadingButton
                    loading={isLoading}
                    onClick={() => getStart()}
                    variant="contained"
                    color="primary"
                    style={isLoading ? { background: '#1565C0' } : {}}
                >
                    Get Start
                </LoadingButton>
            </div>
        </div>
    )
}

export default Splash