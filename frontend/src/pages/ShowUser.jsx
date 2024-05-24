import { Button, Divider, List, ListItem } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'

const ShowUser = () => {
  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('show_user') || '{}'))
  const [edit, setEdit] = useState(false)

  useEffect(()=>{
    setUser({...user, time: dayOrDays(parseInt(user.expiration) - getDayDifference(user.startedAt))})
  }, [user.expiration])


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
    <div style={{ padding: '16px', textAlign: 'center' }}>
      {
        Object.keys(user).map((userKey) => !(userKey === 'deviceId' || userKey === 'createdAt' || userKey === 'startedAt') && <div key={userKey}>
          <ListItem sx={{ fontSize: '16px' }}>
            <b>{userKey}: </b> {!edit && <span>{user[userKey]}</span>} {edit && <input onChange={(e) => {
              setUser({ ...user, [userKey]: e.target.value })
            }} value={user[userKey]} />}
          </ListItem>
          <Divider />
        </div>)
      }
      <Button variant="contained" sx={{ marginTop: '20px' }} onClick={async () => {
        if (edit) {
          try {
            const response = await axios.post('https://uflix.info/server/api/user/update', user);
            window.App.showToast('Save sucessful!')
            setEdit(!edit)
          } catch (e) {
            window.App.showToast(e.message)
          }
        } else {
          setEdit(!edit)
        }
      }}>{edit ? 'Save' : 'Edit'}</Button>
    </div>
  )
}

export default ShowUser