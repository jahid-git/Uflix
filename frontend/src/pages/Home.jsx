import { Button } from '@mui/material'
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('user') || '{}')
    if (user.password && user.phone) {
      user.isLogin = 1;
      axios.post('https://uflix.info/server/api/user/login', user).then((response) => {
        if (response.data) {
          const resUser = response.data;
          if (resUser.expiration) {
            resUser.expiration = (parseInt(resUser.expiration + '') - getDayDifference(resUser.startedAt));
            resUser.expiration = resUser.expiration <= 0 ? 'expired' : dayOrDays(resUser.expiration);
          }

          if (resUser.expiration == 'expired') {
            resUser.status = 'expiry'
          }

          window.localStorage.setItem('user', JSON.stringify(resUser));

          if (resUser.status == 'active') {
            if(window.App){
              const js = "try { document.getElementsByClassName('logo')[0].remove(); } catch(e) {}" +
              "try { document.getElementsByClassName('heading-archive')[0].remove(); } catch(e) {}" +
              "try { document.getElementsByClassName('comments-area')[0].remove(); } catch(e) {}" +
              "try { document.getElementById('st-2').remove(); } catch(e) {}" +
              "try { document.getElementById('logo').remove(); } catch(e) {}" +
              "try { document.getElementById('cookiedata').remove(); } catch(e) {}" +
              "try { document.getElementsByClassName('happy-under-player')[0].remove(); } catch(e) {}" +
              "try { document.getElementsByClassName('happy-under-player-mobile')[0].remove(); } catch(e) {}" +
              "try { document.getElementsByClassName('under-video-block')[0].remove(); } catch(e) {}" +
              "try { document.getElementsByClassName('dt_mainmeta')[0].remove(); } catch(e) {}" +
              "try { document.getElementsByClassName('primary-header')[0].remove(); } catch(e) {}" +
              "try { document.getElementsByClassName('textwidget')[0].remove(); } catch(e) {}" +
              "try { document.getElementsByClassName('my-2')[0].remove(); } catch(e) {}" +
              //"try { document.getElementsByTagName('header')[0].remove(); } catch(e) {}" +
              "try { document.getElementsByTagName('aside')[0].remove(); } catch(e) {}" +
              "try { document.getElementsByTagName('footer')[0].remove(); } catch(e) {}";

              window.App.setPrefs("js", js);
            }
            window.location.replace('https://uflix.info/server/client')
          } else {
            navigate('/' + resUser.status, { replace: true });
          }

        } else {
          navigate('/admin', { replace: true });
        }
      }).catch((error) => {
        window.localStorage.setItem('user', '{}');
        navigate('/login', { replace: true })
      });
    } else {
      window.localStorage.setItem('user', '{}');
      navigate('/login', { replace: true })
    }
  }, [])

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
    <div style={{ height: '100%', width: '100%', position: 'fixed', top: '0px', left: '0px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Loading...</h1>
    </div>
  )
}

export default Home