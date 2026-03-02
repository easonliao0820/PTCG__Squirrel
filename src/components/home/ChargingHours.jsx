import React from 'react';
import styles from '../../styles/components/home/ChargingHours.module.scss';

const ChargingHours = () => {
    return (
        <section className={styles.chargingHours}>
            <div className={styles.container}>
                <h3 className={styles.sectionTitle}>收費方式</h3>
                <div className={styles.grid}>
                    <div className={styles.row}>
                        <div className={`${styles.item} ${styles.label}`}>
                            <span>平日</span>
                        </div>
                        <div className={`${styles.item} ${styles.value}`}>
                            <span>店內低消：一杯飲料</span>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={`${styles.item} ${styles.label}`}>
                            <span>每週六日 & 國定假日</span>
                        </div>
                        <div className={`${styles.item} ${styles.value}`}>
                            <span>每人：每小時50元，整日200元</span>
                        </div>
                    </div>

                    <div className={styles.noteBox}>
                        <h4>備註</h4>
                        <p>
                            {`店內禁帶外食，如需垃圾清理，請洽櫃檯人員。\n座位有限，建議提前預約以確保對戰空間。`}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChargingHours;
