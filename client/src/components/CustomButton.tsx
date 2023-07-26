import { useSnapshot } from 'valtio';
import state from '../store';

const CustomButton = ({
  type,
  title,
  customStyles,
  handleClick,
}: {
  type: string;
  title: string;
  customStyles: string;
  handleClick: () => void;
}) => {
  const snap = useSnapshot(state);
  const generateStyle = (type: string) => {
    if (type === 'filled') {
      return {
        backgroundColor: snap.color,
        color: '#fff',
      };
    }
  };

  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
