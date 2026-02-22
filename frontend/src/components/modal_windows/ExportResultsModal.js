import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalMini from './ModalMini';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf, faCheck } from "@fortawesome/free-solid-svg-icons";

const ExportResultsModal = ({ isOpen, onClose, onExport, loading }) => {
    const { t } = useTranslation();
    const [format, setFormat] = useState('EXCEL');
    const [columns, setColumns] = useState({
        fullName: true, email: true, score: true, status: true, date: true
    });

    const handleExportClick = () => {
        const selectedColumns = Object.keys(columns).filter(key => columns[key]);
        if (selectedColumns.length === 0) return;
        onExport({ format, columns: selectedColumns });
    };

    if (!isOpen) return null;

    return (
        <ModalMini isOpen={isOpen} onClose={loading ? null : onClose}>
            <button className="modal-close" onClick={onClose} disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z" />
                </svg>
            </button>
            
            <div className="invite-modal export-compact">
                <h3 className="modalmini-title">{t('exportModal.title')}</h3>
                <p className="modalmini-subtitle">{t('exportModal.subtitle')}</p>

                <div className="export-format-wrapper">
                    <label className="modal-text">{t('exportModal.formatLabel')}</label>
                    <div className="select-with-icon">
                        <FontAwesomeIcon 
                            icon={format === 'EXCEL' ? faFileExcel : faFilePdf} 
                            className={`format-icon ${format.toLowerCase()}`}
                        />
                        <select className="modal-select" value={format} onChange={e => setFormat(e.target.value)} disabled={loading}>
                            <option value="EXCEL">Excel (.xlsx)</option>
                            <option value="PDF">PDF (.pdf)</option>
                        </select>
                    </div>
                </div>

                <div className="export-columns-wrapper">
                    <label className="modal-text">{t('exportModal.columnsLabel')}</label>
                    <div className="export-grid-compact">
                        {Object.keys(columns).map(col => (
                            <div 
                                key={col} 
                                className={`export-item-mini ${columns[col] ? 'active' : ''}`}
                                onClick={() => !loading && setColumns(prev => ({ ...prev, [col]: !prev[col] }))}
                            >
                                <div className={`mini-checkbox ${columns[col] ? 'checked' : ''}`}>
                                    {columns[col] && <FontAwesomeIcon icon={faCheck} />}
                                </div>
                                <span>{t(`exportModal.columns.${col}`)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modalmini-buttons">
                    <button className="modalmini-button modalmini-button-cancel" onClick={onClose} disabled={loading}>
                        {t('common.cancel')}
                    </button>
                    <button className="modalmini-button modalmini-button-submit" onClick={handleExportClick} disabled={loading}>
                        {loading ? t('common.loading') : t('exportModal.button')}
                    </button>
                </div>
            </div>
        </ModalMini>
    );
};

export default ExportResultsModal;