import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Link from 'components/common/Link';
import styles from './Footer.module.css';
import { CURRENT_VERSION } from 'lib/constants';

export default function Footer() {
  return (
    <footer className={classNames(styles.footer, 'row')}>
      <div className="col-12 col-md-4" />
      <div className="col-12 col-md-4">
        <FormattedMessage
          id="message.powered-by"
          defaultMessage="Powered by {name}"
          values={{
            name: (
              <Link href="https://github.com/David-Aires/Kutsatira">
                <b>David Aires</b>
              </Link>
            ),
          }}
        />
      </div>
      <div className={classNames(styles.version, 'col-12 col-md-4')}>
        <Link href="https://github.com/David-Aires/Kutsatira">{`v${CURRENT_VERSION}`}</Link>
      </div>
    </footer>
  );
}
