import React from 'react';
import CustomTitle from '../components/custom_title/CustomTitle';
import ContactsForm from '../components/Contacts/Contacts';


const Contacts = () => {

    const object = {
      logo: null,
      line: true,
      strong: 'Зв’яжіться з нами!',
      p: null
    }
  
    return (
      <div className="page">
         <CustomTitle title='МАЄТЕ ЗАПИТАННЯ?' data={object} /> 
          <ContactsForm />
      </div>
    )
  }
export default Contacts;
