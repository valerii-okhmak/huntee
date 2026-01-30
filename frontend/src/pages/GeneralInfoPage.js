import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomTitle from '../components/custom_title/CustomTitle';
import BrowserWindow from '../components/browser_window/BrowserWindow';
import BrowserWinText from '../components/browser_win_text/BrowserWinText';
import GeneralInfo from '../components/general_info/GeneralInfo';

const GeneralInfoPage = () => {
    const { t } = useTranslation();

    const object = {
      logo: null,
      line: true,
      strong: t('generalInfoPage.subtitle'),
      p: null
    }
  
    return (
      <div className="page">
          <div className='custom_title_and_browser_window_space'>
         <CustomTitle title={t('generalInfoPage.title')} data={object} /> 
          <BrowserWindow>
            <BrowserWinText company={'Huntee'} text={t('generalInfoPage.browserText')} />
          </BrowserWindow>
          </div>
          <GeneralInfo
          first_step={t('generalInfoPage.steps.first')}
          second_step={t('generalInfoPage.steps.second')}
          third_step={t('generalInfoPage.steps.third')}
          title_button1={t('generalInfoPage.buttons.batches')}
          title_button2={t('generalInfoPage.buttons.create')}
          />
      </div>
    )
  }
export default GeneralInfoPage;