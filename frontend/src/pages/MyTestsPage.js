import React from 'react'
import CustomTitle from '../components/custom_title/CustomTitle';
import MyTests from '../components/my_tests/MyTests';

const MyTestsPage = () => {

  const object = {
    logo: null,
    line: false,
    strong: null,
    p: null
  }

  return (
    <div className="page">
        <CustomTitle title='МОЇ ТЕСТИ' data={object} />
        <MyTests/>
    </div>
  )
}

export default MyTestsPage