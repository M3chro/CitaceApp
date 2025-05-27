import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Language } from '../utils/api';
import { getResponsiveFontSize } from '../utils/uiHelpers';

/**
 * Props pro komponentu LanguageSelector.
 */
interface LanguageSelectorProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  languages: Language[];
  enabled: boolean;
  label?: string;
}

/**
 * Komponenta `LanguageSelector` zobrazuje popisek a nativní Picker prvek
 * pro výběr jazyka ze zadaného seznamu.
 * @param {LanguageSelectorProps} props - Props pro komponentu.
 * @returns {JSX.Element} Element komponenty.
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedValue,
  onValueChange,
  languages,
  enabled,
  label = "Jazyk:",
}) => {
  return (
    <View style={styles.pickerWrapper}>
      {label && <Text style={styles.pickerLabel}>{label}</Text>}
      <View style={styles.pickerBorder}>
        <Picker
          selectedValue={selectedValue}
          style={styles.picker}
          onValueChange={(itemValue: string) => {
            if (itemValue) onValueChange(itemValue);
          }}
          enabled={enabled}
          prompt="Vyberte jazyk"
          itemStyle={Platform.OS === 'ios' ? styles.pickerItemIOS : undefined} 
        >
          {languages.map((lang) => (
            <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerWrapper: {
    width: '100%',
    maxWidth: 350,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  pickerLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
    marginLeft: 5,
  },
  pickerBorder: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#000000',
    height: Platform.OS === 'ios' ? 180 : 60,
  },
  pickerItemIOS: {
    height: 180,
    color: '#000000',
    fontSize: getResponsiveFontSize(20),
  },
});

export default LanguageSelector;