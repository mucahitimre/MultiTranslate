import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`;

const TranslationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const TranslationBox = styled.input`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #e8e6ff;
  font-size: 1rem;
  margin-bottom: 1rem;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #6c63ff;
  }
`;

const TranslationsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: ${props => props.inTable ? 'transparent' : '#e8e6ff'};
  border-radius: 8px;
  overflow: hidden;
`;

const TranslationItem = styled.li`
  padding: 0.8rem 1rem;
  border-bottom: 1px solid ${props => props.inTable ? '#e0e0e0' : 'rgba(108, 99, 255, 0.1)'};
  font-size: 1rem;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${props => props.inTable ? '#f5f5f5' : 'rgba(108, 99, 255, 0.1)'};
  }

  ${props => props.isMainTranslation && `
    font-weight: 500;
    color: #6c63ff;
  `}
`;

const ActionButton = styled.button`
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(108, 99, 255, 0.1);

  &:hover {
    background-color: #5a52cc;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(108, 99, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(108, 99, 255, 0.1);
  }
`;

const ToggleButton = styled(ActionButton)`
  background-color: ${props => props.active ? '#6c63ff' : 'white'};
  color: ${props => props.active ? 'white' : '#6c63ff'};
  border: 1px solid #6c63ff;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(108, 99, 255, 0.1);

  &:hover {
    background-color: ${props => props.active ? '#5a52cc' : '#f8f9ff'};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(108, 99, 255, 0.2);
  }
`;

const TranslateButton = styled(ActionButton)`
  padding: 0.8rem 2rem;
  font-size: 1rem;
`;

const LanguageSelect = styled.select`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  margin-top: 1rem;
  text-align: center;
`;

const SelectionInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #6c63ff;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  margin-left: 1rem;
  &:hover {
    color: #5a52cc;
  }
`;

const LanguageContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const LanguageLabel = styled.label`
  font-size: 0.9rem;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
`;

const HistoryButton = styled.button`
  background: none;
  border: none;
  color: #6c63ff;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  margin-left: 1rem;
  &:hover {
    color: #5a52cc;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const TableContainer = styled.div`
  margin-top: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  background: white;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
  background-color: white;
`;

const Th = styled.th`
  background-color: #6c63ff;
  color: white;
  padding: 1.2rem 1rem;
  text-align: left;
  border-bottom: 2px solid #5a52cc;
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td`
  padding: 1.5rem 1rem;
  background-color: ${props => props.isLastTranslation ? '#f8f9ff' : 'white'};
  transition: all 0.3s ease;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;

  &:first-child {
    border-left: 1px solid #e0e0e0;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:last-child {
    border-right: 1px solid #e0e0e0;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  ${props => props.isLastTranslation && `
    border-color: #d0d4ff;
    border-bottom-color: #6c63ff;
  `}
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  &:hover {
    background-color: #f8f9ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(108, 99, 255, 0.1);

    td {
      border-color: #d0d4ff;
    }
  }

  ${props => props.isLastTranslation && `
    background-color: #f8f9ff;
    box-shadow: 0 4px 8px rgba(108, 99, 255, 0.1);
  `}
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f8f9ff;
  border-bottom: 1px solid #e0e0e0;
`;

const TableTitle = styled.h3`
  color: #333;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: '📋';
    font-size: 1.3rem;
  }
`;

const TableControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ImportExportGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  &:hover {
    background-color: #ffeeee;
  }
`;

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translations, setTranslations] = useState([]);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('tr');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLanguageColumns, setShowLanguageColumns] = useState(false);
  const [translationHistory, setTranslationHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('translationHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading translation history:', error);
      return [];
    }
  });
  const [availableLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Turkish' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
  ]);
  
  useEffect(() => {
    try {
      localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
    } catch (error) {
      console.error('Error saving translation history:', error);
    }
  }, [translationHistory]);

  const handleTranslate = async () => {
    if (!inputText || !inputText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    setError('');
    setTranslations([]);

    try {
      const response = await axios.get(`https://api.mymemory.translated.net/get`, {
        params: {
          q: inputText.trim().toLowerCase(),
          langpair: `${sourceLang}|${targetLang}`,
        },
        timeout: 15000,
      });
      
      if (response.data && response.data.responseData) {
        const mainTranslation = response.data.responseData.translatedText.toLowerCase();
        const matches = response.data.matches || [];
        
        // Get all translations including matches
        const allTranslations = [
          mainTranslation,
          ...matches
            .filter(match => match.translation && typeof match.translation === 'string')
            .map(match => match.translation.toLowerCase())
        ];

        // Filter out translations that are the same as input text and remove duplicates
        const inputTextLower = inputText.trim().toLowerCase();
        
        // Helper function to check if text contains emoji or special characters
        const containsEmojiOrSpecial = (text) => {
          const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F100}-\u{1F1FF}]|[\u{1F200}-\u{1F2FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2B50}]|[\u{2000}-\u{206F}]/u;
          return emojiRegex.test(text) || /[^\w\s\u0080-\u024F-]/g.test(text);
        };

        const filteredTranslations = Array.from(new Set(
          allTranslations.filter(trans => 
            trans !== inputTextLower && 
            trans.length > 0 && 
            !trans.includes('!') && // Filter out error messages
            !trans.includes('?') && // Filter out questions
            !/^\d+$/.test(trans) && // Filter out numbers-only translations
            !containsEmojiOrSpecial(trans) // Filter out emojis and special characters
          )
        ));

        // Only proceed if we have valid translations
        if (filteredTranslations.length > 0) {
          // Remove any remaining duplicates (case-insensitive)
          const uniqueTranslations = filteredTranslations.filter((trans, index, self) =>
            index === self.findIndex(t => t.toLowerCase() === trans.toLowerCase())
          );

          setTranslations(uniqueTranslations);
          setTranslatedText(uniqueTranslations[0]);

          // Save to history with unique translations
          const newTranslation = {
            id: Date.now(),
            original: inputTextLower,
            translated: uniqueTranslations[0],
            alternativeTranslations: uniqueTranslations,
            timestamp: new Date().toLocaleString(),
            sourceLang,
            targetLang,
          };

          setTranslationHistory(prev => [newTranslation, ...prev]);
          setInputText('');
          setError('');
        } else {
          setError('No valid translation found. The word might be the same in both languages.');
          setTranslations([]);
          setTranslatedText('');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Translation error:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Translation request timed out. Please try again.');
      } else if (error.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (error.response?.status === 503) {
        setError('Service temporarily unavailable. Please try again later.');
      } else {
        setError('Error translating text. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSelection = () => {
    setInputText('');
    setTranslatedText('');
    setError('');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all translation history?')) {
      setTranslationHistory([]);
      try {
        localStorage.removeItem('translationHistory');
      } catch (error) {
        console.error('Error clearing translation history:', error);
      }
    }
  };

  const handleDeleteTranslation = (id) => {
    setTranslationHistory(prev => prev.filter(t => t.id !== id));
  };

  const getLanguageName = (code) => {
    const language = availableLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && inputText.trim()) {
      handleTranslate();
    }
  };

  const handleExport = () => {
    try {
      const escapeCsvField = (field) => {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      };

      const csvRows = [
        ['Timestamp', 'From Language', 'To Language', 'Original Text', 'Main Translation', 'Alternative Translations'],
        ...translationHistory.map(t => [
          escapeCsvField(t.timestamp),
          escapeCsvField(getLanguageName(t.sourceLang)),
          escapeCsvField(getLanguageName(t.targetLang)),
          escapeCsvField(t.original),
          escapeCsvField(t.translated),
          escapeCsvField(t.alternativeTranslations?.join('; ') || '')
        ])
      ];

      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `translations_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export translations. Please try again.');
    }
  };

  const handleImport = (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          // Split by newline and handle both \n and \r\n
          const rows = text.split(/\r?\n/).filter(row => row.trim());
          
          // Skip header row and process data
          const newTranslations = rows.slice(1).map(row => {
            // Handle quoted fields properly
            const fields = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            const [timestamp, fromLang, toLang, original, translated] = fields.map(field => 
              field.replace(/^"|"$/g, '').replace(/""/g, '"')
            );

            // Find language codes
            const sourceLangObj = availableLanguages.find(l => l.name === fromLang);
            const targetLangObj = availableLanguages.find(l => l.name === toLang);

            return {
              id: Date.now() + Math.random(),
              timestamp: timestamp || new Date().toLocaleString(),
              sourceLang: sourceLangObj?.code || 'en',
              targetLang: targetLangObj?.code || 'tr',
              original: original || '',
              translated: translated || ''
            };
          }).filter(translation => translation.original && translation.translated);

          if (newTranslations.length === 0) {
            setError('No valid translations found in the imported file.');
            return;
          }

          setTranslationHistory(prev => {
            const combined = [...newTranslations, ...prev];
            // Remove duplicates based on content and timestamp
            const unique = combined.filter((translation, index, self) =>
              index === self.findIndex(t => (
                t.original === translation.original &&
                t.translated === translation.translated &&
                t.timestamp === translation.timestamp
              ))
            );
            return unique;
          });

          setError('');
          event.target.value = ''; // Reset file input
        } catch (error) {
          console.error('Import parsing error:', error);
          setError('Failed to parse the imported file. Please check the file format.');
        }
      };

      reader.onerror = () => {
        setError('Failed to read the imported file. Please try again.');
      };

      reader.readAsText(file, 'UTF-8');
    } catch (error) {
      console.error('Import error:', error);
      setError('Failed to import translations. Please try again.');
    }
  };

  return (
    <Container>
      <Title>Word Translator</Title>
      <TranslationGrid>
        <Column>
          <ColumnTitle>word</ColumnTitle>
          <LanguageLabel>
            From:
            <LanguageSelect
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </LanguageSelect>
          </LanguageLabel>
          <TranslationBox
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value.toLowerCase())}
            onKeyPress={handleKeyPress}
            placeholder="enter text to translate..."
          />
        </Column>
        <Column>
          <ColumnTitle>translate</ColumnTitle>
          <LanguageLabel>
            To:
            <LanguageSelect
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </LanguageSelect>
          </LanguageLabel>
          {translations.length > 0 ? (
            <TranslationsList>
              {translations.map((translation, index) => (
                <TranslationItem key={index}>
                  {translation}
                </TranslationItem>
              ))}
            </TranslationsList>
          ) : (
            <TranslationBox
              type="text"
              value={translatedText}
              readOnly
              placeholder="translation will appear here..."
            />
          )}
        </Column>
      </TranslationGrid>
      <ButtonGroup>
        <TranslateButton 
          onClick={handleTranslate}
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? 'translating...' : 'translate'}
        </TranslateButton>
        {translationHistory.length > 0 && (
          <HistoryButton onClick={handleClearHistory}>
            clear all history
          </HistoryButton>
        )}
      </ButtonGroup>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {translationHistory.length > 0 && (
        <TableContainer>
          <TableHeader>
            <TableTitle>Translation History</TableTitle>
            <TableControls>
              <ImportExportGroup>
                <HiddenInput
                  type="file"
                  id="importFile"
                  accept=".csv"
                  onChange={handleImport}
                />
                <ActionButton onClick={() => document.getElementById('importFile').click()}>
                  import csv
                </ActionButton>
                <ActionButton onClick={handleExport}>
                  export csv
                </ActionButton>
              </ImportExportGroup>
              <ToggleButton
                active={showLanguageColumns}
                onClick={() => setShowLanguageColumns(!showLanguageColumns)}
              >
                {showLanguageColumns ? 'Hide Languages' : 'Show Languages'}
              </ToggleButton>
            </TableControls>
          </TableHeader>
          <Table>
            <thead>
              <tr>
                <Th>time</Th>
                {showLanguageColumns && (
                  <>
                    <Th>from</Th>
                    <Th>to</Th>
                  </>
                )}
                <Th>original text</Th>
                <Th>translations</Th>
                <Th>actions</Th>
              </tr>
            </thead>
            <tbody>
              {translationHistory.map((translation, index) => (
                <TableRow key={translation.id} isLastTranslation={index === 0}>
                  <Td isLastTranslation={index === 0}>{translation.timestamp}</Td>
                  {showLanguageColumns && (
                    <>
                      <Td isLastTranslation={index === 0}>{getLanguageName(translation.sourceLang)}</Td>
                      <Td isLastTranslation={index === 0}>{getLanguageName(translation.targetLang)}</Td>
                    </>
                  )}
                  <Td isLastTranslation={index === 0}>{translation.original}</Td>
                  <Td isLastTranslation={index === 0}>
                    <TranslationsList inTable>
                      {translation.alternativeTranslations?.map((t, i) => (
                        <TranslationItem 
                          key={i} 
                          inTable 
                          isMainTranslation={i === 0}
                        >
                          {t}
                        </TranslationItem>
                      ))}
                    </TranslationsList>
                  </Td>
                  <Td isLastTranslation={index === 0}>
                    <DeleteButton onClick={() => handleDeleteTranslation(translation.id)}>
                      delete
                    </DeleteButton>
                  </Td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default App; 