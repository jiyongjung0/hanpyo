import Papa from 'papaparse';
import type { ForeignWordEntry } from '../types/ForeignWord';
import csvFile from '../assets/data.csv?url';

export const loadCSVData = async (): Promise<ForeignWordEntry[]> => {
  try {
    const response = await fetch(csvFile);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<ForeignWordEntry>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('CSV 로딩 에러:', error);
    throw error;
  }
};
