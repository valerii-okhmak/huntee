import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomTitle from '../components/custom_title/CustomTitle';
import BrowserWindow from '../components/browser_window/BrowserWindow';
import BrowserWinText from '../components/browser_win_text/BrowserWinText';
import CreateTestInfo from '../components/create_test_info/CreateTestInfo';

const StartIT = () => {
    const { t } = useTranslation();

    const object = {
      logo: null,
      line: true,
      strong: t('startITPage.subtitle'),
      p: null
    }
  
    return (
      <div className="page">
        <div className='custom_title_and_browser_window_space'>
         <CustomTitle title={t('startITPage.title')} data={object} /> 
          <BrowserWindow>
            <BrowserWinText who={t('startITPage.who')} company={'Huntee'} text={t('startITPage.browserText')} />
          </BrowserWindow>
          </div>
          <CreateTestInfo
          main_title={"HERE'S YOUR FUTURE"}
          title_button={t('startITPage.button')}
          first_step={t('startITPage.steps.first')}
          second_step={t('startITPage.steps.second')}
          third_step={t('startITPage.steps.third')}
          four_step={t('startITPage.steps.fourth')}/>
      </div>
    )
  }
export default StartIT;