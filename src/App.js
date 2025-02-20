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

const TranslateButton = styled.button`
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #5a52cc;
  }
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
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
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
`;

const Th = styled.th`
  background-color: #6c63ff;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background-color: ${props => props.isLastTranslation ? '#e8e6ff' : 'white'};
  transition: background-color 0.3s ease;
`;

const ImportExportGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background-color: #5a52cc;
  }
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
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('tr');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
  const [selectedText, setSelectedText] = useState('');
  
  // Initialize translationHistory from localStorage
  const [translationHistory, setTranslationHistory] = useState(() => {
    const savedHistory = localStorage.getItem('translationHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Text selection effect
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText) {
        setInputText(selectedText);
        setSelectedText(selectedText);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
    };
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [translationHistory]);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get(`https://api.mymemory.translated.net/get`, {
        params: {
          q: inputText.trim().toLowerCase(),
          langpair: `${sourceLang}|${targetLang}`,
        },
        timeout: 15000,
      });
      
      if (response.data && response.data.responseData && response.data.responseData.translatedText) {
        const newTranslation = {
          id: Date.now(),
          original: inputText.trim().toLowerCase(),
          translated: response.data.responseData.translatedText.toLowerCase(),
          timestamp: new Date().toLocaleString(),
          sourceLang,
          targetLang,
        };

        setTranslationHistory(prev => [newTranslation, ...prev]);
        setInputText('');
        setTranslatedText('');
        setError('');
        setSelectedText('');
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
    setSelectedText('');
    setInputText('');
    setTranslatedText('');
    setError('');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all translation history?')) {
      setTranslationHistory([]);
      localStorage.removeItem('translationHistory');
      setError('');
    }
  };

  const handleDeleteTranslation = (id) => {
    setTranslationHistory(prev => {
      const newHistory = prev.filter(t => t.id !== id);
      localStorage.setItem('translationHistory', JSON.stringify(newHistory));
      return newHistory;
    });
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
      // Properly escape CSV fields
      const escapeCsvField = (field) => {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      };

      const csvRows = [
        ['Timestamp', 'From Language', 'To Language', 'Original Text', 'Translated Text'],
        ...translationHistory.map(t => [
          escapeCsvField(t.timestamp),
          escapeCsvField(getLanguageName(t.sourceLang)),
          escapeCsvField(getLanguageName(t.targetLang)),
          escapeCsvField(t.original),
          escapeCsvField(t.translated)
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
      {selectedText && (
        <SelectionInfo>
          Selected text detected
          <ClearButton onClick={handleClearSelection}>Clear</ClearButton>
        </SelectionInfo>
      )}
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
          <TranslationBox
            type="text"
            value={translatedText}
            readOnly
            placeholder="translation will appear here..."
          />
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
          <>
            <HistoryButton onClick={handleClearHistory}>
              clear all history
            </HistoryButton>
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
          </>
        )}
      </ButtonGroup>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {translationHistory.length > 0 && (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>time</Th>
                <Th>from</Th>
                <Th>to</Th>
                <Th>original text</Th>
                <Th>translated text</Th>
                <Th>actions</Th>
              </tr>
            </thead>
            <tbody>
              {translationHistory.map((translation, index) => (
                <tr key={translation.id}>
                  <Td isLastTranslation={index === 0}>{translation.timestamp}</Td>
                  <Td isLastTranslation={index === 0}>{getLanguageName(translation.sourceLang)}</Td>
                  <Td isLastTranslation={index === 0}>{getLanguageName(translation.targetLang)}</Td>
                  <Td isLastTranslation={index === 0}>{translation.original}</Td>
                  <Td isLastTranslation={index === 0}>{translation.translated}</Td>
                  <Td isLastTranslation={index === 0}>
                    <DeleteButton onClick={() => handleDeleteTranslation(translation.id)}>
                      delete
                    </DeleteButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default App; 