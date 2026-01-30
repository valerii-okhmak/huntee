import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomTitle from '../components/custom_title/CustomTitle';
import ContactsForm from '../components/Contacts/Contacts';

const Contacts = () => {
    const { t } = useTranslation();

    const object = {
      logo: null,
      line: true,
      strong: t('contactsPage.subtitle'),
      p: null
    }
  
    return (
      <div className="page">
         <CustomTitle title={t('contactsPage.title')} data={object} /> 
          <ContactsForm />
      </div>
    )
  }
export default Contacts;