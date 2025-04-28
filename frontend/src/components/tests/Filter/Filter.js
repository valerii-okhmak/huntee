import React from 'react'
import './Filter.css'

const Filter = () => {
  return (
    <div className='filter'>
      <div className='filer_name'>
        <h2 className='filter_title'>ЛОКАЦІЯ</h2>
        <div className='filter_button'></div>
      </div>
      <div className='filter_section'>
        <div className='option'>
          <input type='checkbox' className='input' id='check1_1'></input>
          <label className='laber' htmlFor='check1_1'>Львів</label>
        </div>
        <div className='option'>
          <input type='checkbox' className='input' id='check1_2'></input>
          <label className='laber' htmlFor='check1_2'>Львів</label>
        </div>
        <div className='option'>
          <input type='checkbox' className='input' id='check1_3'></input>
          <label className='laber' htmlFor='check1_3'>Львів</label>
        </div>
      </div>
    </div>
  )
}

export default Filter