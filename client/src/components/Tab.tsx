import { useSnapshot } from 'valtio';

import state from '../store';

type Tab = {
  name: string;
  icon: string;
};

const Tab = ({
  tab,
  isFilterTab,
  isActiveTab,
  handleClick,
}: {
  tab: Tab;
  isFilterTab?: boolean;
  isActiveTab?: boolean;
  handleClick: () => void;
}) => {
  const snap = useSnapshot(state);

  const activeStyles =
    isFilterTab && isActiveTab
      ? { backgroundColod: snap.color, opacity: 0.5 }
      : { backgroundColor: 'transpetent', opacity: 1 };
  return (
    <div
      key={tab.name}
      className={`tab-btn ${isFilterTab ? 'rounded-full glassmorphism' : 'rouded-4'}`}
      onClick={handleClick}
      style={activeStyles}
    >
      <img
        src={tab.icon}
        alt={tab.name}
        className={`${isFilterTab} ? 'w-2/3 h-2/3' : 'w-11/12 h-11/12 object-contain'`}
      />
    </div>
  );
};

export default Tab;
