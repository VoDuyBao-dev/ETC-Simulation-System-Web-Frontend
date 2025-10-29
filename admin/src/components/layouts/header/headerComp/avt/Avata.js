import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import avt from '~/assets/imgs/img.jpg'
import styles from './Avata.module.scss'

function Avata(){
    return(
        <div className={styles.account}>
            <div className={styles.accountAvt}>
                <div className={styles.accountImg}>
                    <img src={avt} className={styles.accountImgItem}></img>
                </div>
                <div className={styles.accountIcon}>
                    <span className={styles.accountIconItem}>
                        <FontAwesomeIcon icon={faAngleDown}/>
                    </span>
                </div>
            </div>
        </div>
    )    
}
export default Avata;