import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';
import state from '../store';

type FilterTabKeys = 'logoShirt' | 'stylishShirt';
type FilterTab = Record<FilterTabKeys, boolean>;

type DecalTypeKeys = keyof typeof DecalTypes;
type DecalResult = string;

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState<File | null>(null);

  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>({
    logoShirt: true,
    stylishShirt: false,
  });

  // show tab content depending on the acriveTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />;
      case 'filepicker':
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case 'aipicker':
        return <AIPicker />;
      default:
        return null;
    }
  };

  // const handleSubmit = async (type) => {
  //   if (!prompt) return alert('Please enter a prompt');

  //   try {
  //     setGeneratingImg(true);

  //     const response = await fetch('http://localhost:8080/api/v1/dalle', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         prompt,
  //       }),
  //     });

  //     const data = await response.json();

  //     handleDecals(type, `data:image/png;base64,${data.photo}`);
  //   } catch (error) {
  //     alert(error);
  //   } finally {
  //     setGeneratingImg(false);
  //     setActiveEditorTab('');
  //   }
  // };

  const handleActiveFilterTab = (tabName: FilterTabKeys) => {
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState: FilterTab) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const handleDecals = (type: DecalTypeKeys, result: DecalResult) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    const filterTabName = decalType.filterTab as keyof typeof activeFilterTab;
    if (!activeFilterTab[filterTabName]) {
      handleActiveFilterTab(filterTabName);
    }
  };

  const readFile = (type: 'logo' | 'full') => {
    if (!file) return;
    reader(file).then((result) => {
      handleDecals(type, result as string);
      setActiveEditorTab('');
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {
                      setActiveEditorTab(tab.name);
                    }}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div className="absolute z-10 top-5 right-5" {...fadeAnimation}>
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          <motion.div className="filtertabs-container" {...slideAnimation('up')}>
            {FilterTabs.map((tab) => {
              const name = tab.name as keyof typeof activeFilterTab;
              return (
                <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[name]}
                  handleClick={() => {
                    handleActiveFilterTab(name);
                  }}
                />
              );
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
