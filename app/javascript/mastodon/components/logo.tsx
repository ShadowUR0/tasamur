import classNames from 'classnames';

import logo from '@/images/logo.svg';

// Use the supplied symbol until a finished Tasamur wordmark is available.
export const WordmarkLogo: React.FC = () => (
  <IconLogo className='logo--wordmark' />
);

export const IconLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src={logo}
    alt='Tasamur'
    className={classNames('logo logo--icon', className)}
  />
);

export const SymbolLogo: React.FC = () => <IconLogo />;
