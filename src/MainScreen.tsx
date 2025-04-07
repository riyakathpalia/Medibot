import React, { useState } from 'react';
import arrowBackIcon from './assets/arrow_back.svg';
import newChatIcon from './assets/new_chat.svg';
import settingIcon from './assets/setting.svg';
//import searchIconAsset from './assets/searchIcon.svg';
import cazeLogo from './assets/caze.jpg';

import ChatInterface from './components/chatbot';
import MedicalUploader from './components/settings';
import NewWorkspaceDialog from './components/NewWorkspaceDialog';
import { FileData } from '../src/components/types';

interface ChatSession {
  id: string;
  title: string;
}

interface IconButtonProps {
  iconSrc: string;
  buttonName: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface ChatHeaderProps {
  title: string;
}

interface MainContentProps {
  activeChatId: string | null;
  title: string;
}

interface SidebarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onChatSelect: (id: string) => void;
  onSettingsClick: (id: string) => void;
  onBackClick: () => void;
  setChatSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  setWorkspaceDetails: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        llmPreference: 'offline' | 'online';
        medicalFiles: FileData[];
        patientFiles: FileData[];
      };
    }>
  >;
}

const IconButton: React.FC<IconButtonProps> = ({ iconSrc, buttonName, onClick, disabled }) => {
  const isDarkButton = buttonName === 'Dashboard' || buttonName === 'New Patient Workspace';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '0.5rem',
        outline: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '12px',
        background: isDarkButton ? 'rgb(20, 20, 20)' : 'none',
        border: 'none',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <div
        style={{
          width: '2rem',
          height: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0.6,
        }}
      >
        <img src={iconSrc} alt={buttonName} style={{ width: '42px', height: '42px' }} />
      </div>
      <div
        style={{
          color: isDarkButton ? 'white' : 'black',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {buttonName}
      </div>
    </button>
  );
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '12px',
      borderBottom: '1px solid #444',
    }}
  >
    <img
      src={cazeLogo}
      alt="Caze Logo"
      style={{
        width: '300px',
        height: '90px',
        marginBottom: '8px',
      }}
    />
    <div
      style={{
        fontSize: '20px',
        fontWeight: 500,
        color: 'white',
        letterSpacing: '6px',
        fontFamily: "'Montserrat', sans-serif",
        textAlign: 'center',
      }}
    >
      {title}
    </div>
  </div>
);

const MainContent: React.FC<MainContentProps> = ({ activeChatId, title }) => (
  <div
    style={{
      flex: '5 2 0%',
      padding: '28px',
      border: '1px solid #ddd',
      borderRadius: '16px',
      background: 'rgb(20, 20, 20)',
      color: 'white',
      height: '100%',
      gap: '10px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <ChatHeader title={title} />
    {activeChatId ? <ChatInterface key={activeChatId} /> : <div>Select a chat session or create a new one.</div>}
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  chatSessions,
  activeChatId,
  onChatSelect,
  onSettingsClick,
  onBackClick,
  setChatSessions,
  setActiveChatId,
  setWorkspaceDetails,
}) => {
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);

  const handleCreateWorkspace = (workspaceData: {
    name: string;
    files: { medical: FileData[]; patient: FileData[] };
  }) => {
    const newId = Date.now().toString();
    setChatSessions((prev) => [...prev, { id: newId, title: workspaceData.name }]);
    setWorkspaceDetails((prev) => ({
      ...prev,
      [newId]: {
        llmPreference: 'offline',
        medicalFiles: workspaceData.files.medical,
        patientFiles: workspaceData.files.patient,
      },
    }));
    setActiveChatId(newId);
    setShowNewWorkspaceDialog(false);
  };

  const handleDeleteChat = (id: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  return (
    <div
      style={{
        flex: 1,
        border: '1px solid #ddd',
        borderRadius: '16px',
        background: '#FFFFFF',
        color: 'black',
        height: '100%',
        overflow: 'auto',
        alignSelf: 'flex-start',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <img src={cazeLogo} alt="Caze Logo" style={{ maxWidth: '100%' }} />
          <img
            src={arrowBackIcon}
            alt="Back"
            onClick={onBackClick}
            style={{ width: '38px', height: '38px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginTop: '1px' }}>
          <IconButton
            iconSrc={newChatIcon}
            buttonName="Dashboard"
            onClick={() => {
              setActiveChatId('default');
            }}
          />
          <IconButton
            iconSrc={newChatIcon}
            buttonName="New Patient Workspace"
            onClick={() => setShowNewWorkspaceDialog(true)}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <strong style={{ fontSize: '16px', color: '#333' }}>Recent</strong>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '8px' }}>
            {chatSessions.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: activeChatId === s.id ? 'rgb(20, 20, 20)' : 'transparent',
                  color: activeChatId === s.id ? '#fff' : '#333',
                  cursor: 'pointer',
                  marginBottom: '4px',
                }}
              >
                <span onClick={() => onChatSelect(s.id)} style={{ flex: 1 }}>{s.title}</span>
                <img
                  src={settingIcon}
                  alt="Settings"
                  onClick={() => onSettingsClick(s.id)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                />
                <button
                  onClick={() => handleDeleteChat(s.id)}
                  style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNewWorkspaceDialog && (
        <NewWorkspaceDialog onClose={() => setShowNewWorkspaceDialog(false)} onCreate={handleCreateWorkspace} />
      )}
    </div>
  );
};

export const MainScreen: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([{ id: 'default', title: 'Default Chat' }]);
  const [activeChatId, setActiveChatId] = useState<string | null>('default');
  const [showSettings, setShowSettings] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<{
    [key: string]: { llmPreference: 'offline' | 'online'; medicalFiles: FileData[]; patientFiles: FileData[] };
  }>({
    default: { llmPreference: 'offline', medicalFiles: [], patientFiles: [] },
  });

  const handleLLMPreferenceChange = (preference: 'offline' | 'online') => {
    if (!activeChatId) return;
    setWorkspaceDetails((prev) => ({
      ...prev,
      [activeChatId]: { ...prev[activeChatId], llmPreference: preference },
    }));
  };

  const handleChatSelect = (id: string) => {
    setActiveChatId(id);
    setShowSettings(false);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        backgroundColor: '#F5F5F5',
        color: '#fff',
        overflow: 'hidden',
        padding: '8px 8px 0px 0px',
      }}
    >
      <div style={{ display: 'flex', margin: '0px', gap: '10px', minHeight: 0, padding: '8px 8px 0px 0px', width: '100%' }}>
        <Sidebar
          chatSessions={chatSessions}
          activeChatId={activeChatId}
          onChatSelect={handleChatSelect}
          onSettingsClick={(id) => {
            setActiveChatId(id);
            setShowSettings(true);
          }}
          onBackClick={() => setShowSettings(false)}
          setChatSessions={setChatSessions}
          setActiveChatId={setActiveChatId}
          setWorkspaceDetails={setWorkspaceDetails}
        />

        {showSettings && activeChatId ? (
          <div
            style={{
              flex: '5 2 0%',
              padding: '28px',
              border: '1px solid #ddd',
              borderRadius: '16px',
              background: '#FFFFFF',
              color: 'black',
              height: '100%',
              gap: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MedicalUploader
              workspaceDetails={workspaceDetails[activeChatId]}
              onLLMPreferenceChange={handleLLMPreferenceChange}
            />
          </div>
        ) : (
          <MainContent activeChatId={activeChatId} title={chatSessions.find((c) => c.id === activeChatId)?.title || 'Chat'} />
        )}
      </div>
    </div>
  );
};
