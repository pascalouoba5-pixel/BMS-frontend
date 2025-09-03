import React, { useState, useEffect, useCallback } from 'react';
import { scheduledSearchesAPI } from '../services/api';

interface CustomSchedule {
  weekDays?: number[];
  hours?: number[];
  intervalHours?: number;
  monthDays?: number[];
}

interface PeriodOption {
  value: string;
  label: string;
  description: string;
}

interface FrequencyOption {
  value: string;
  label: string;
  description: string;
}

interface CustomizationOptions {
  weekDays: { value: number; label: string }[];
  hours: { value: number; label: string }[];
  monthDays: { value: number; label: string }[];
}

interface ScheduledSearchConfigProps {
  frequency: string;
  customSchedule: CustomSchedule | null;
  keywords: string;
  period: string;
  onFrequencyChange: (frequency: string) => void;
  onCustomScheduleChange: (schedule: CustomSchedule | null) => void;
  onPeriodChange: (period: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ScheduledSearchConfig({
  frequency,
  customSchedule,
  period,
  onFrequencyChange,
  onCustomScheduleChange,
  onPeriodChange,
  onSave,
  onCancel
}: ScheduledSearchConfigProps) {
  const [frequencies, setFrequencies] = useState<FrequencyOption[]>([]);
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOptions | null>(null);
  const [localCustomSchedule, setLocalCustomSchedule] = useState<CustomSchedule>(customSchedule || {});

  // Options de période
  const periodOptions: PeriodOption[] = [
    { value: 'all', label: 'Toutes les périodes', description: 'Recherche continue sans limite de temps' },
    { value: 'today', label: 'Aujourd&apos;hui', description: 'Offres publiées aujourd&apos;hui uniquement' },
    { value: 'week', label: 'Cette semaine', description: 'Offres publiées cette semaine' },
    { value: 'month', label: 'Ce mois', description: 'Offres publiées ce mois' },
    { value: 'quarter', label: 'Ce trimestre', description: 'Offres publiées ce trimestre' },
    { value: 'year', label: 'Cette année', description: 'Offres publiées cette année' },
    { value: 'custom', label: 'Période personnalisée', description: 'Définir une période spécifique' }
  ];

  const loadOptions = useCallback(async () => {
    try {
      const response = await scheduledSearchesAPI.getOptions();
      if (response.success) {
        setFrequencies(response.frequencies);
        setCustomizationOptions(response.customizationOptions);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des options:', error);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleFrequencyChange = (newFrequency: string) => {
    onFrequencyChange(newFrequency);
    if (newFrequency !== 'custom') {
      onCustomScheduleChange(null);
      setLocalCustomSchedule({});
    }
  };

  const handleCustomScheduleChange = (field: keyof CustomSchedule, value: string[] | number) => {
    const newSchedule = { ...localCustomSchedule };
    
    if (Array.isArray(value)) {
      (newSchedule as Record<string, string[]>)[field] = value;
    } else if (typeof value === 'number') {
      (newSchedule as Record<string, number>)[field] = value;
    }
    
    setLocalCustomSchedule(newSchedule);
    onCustomScheduleChange(newSchedule);
  };

  const handleSave = () => {
    onSave();
  };

  const renderCustomScheduleForm = () => {
    if (frequency !== 'custom') return null;

    return (
      <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          Configuration personnalisée
        </h4>
        
        {/* Jours de la semaine */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Jours de la semaine
          </label>
          <div className="grid grid-cols-7 gap-2">
            {customizationOptions?.weekDays.map((day) => (
              <label key={day.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localCustomSchedule.weekDays?.includes(day.value) || false}
                  onChange={(e) => {
                    const currentDays = localCustomSchedule.weekDays || [];
                    if (e.target.checked) {
                      handleCustomScheduleChange('weekDays', [...currentDays, day.value]);
                    } else {
                      handleCustomScheduleChange('weekDays', currentDays.filter(d => d !== day.value));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {day.label.slice(0, 3)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Heures spécifiques */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Heures d'exécution
          </label>
          <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
            {customizationOptions?.hours.map((hour) => (
              <label key={hour.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localCustomSchedule.hours?.includes(hour.value) || false}
                  onChange={(e) => {
                    const currentHours = localCustomSchedule.hours || [];
                    if (e.target.checked) {
                      handleCustomScheduleChange('hours', [...currentHours, hour.value]);
                    } else {
                      handleCustomScheduleChange('hours', currentHours.filter(h => h !== hour.value));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {hour.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Intervalle en heures */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Intervalle en heures
          </label>
          <input
            type="number"
            min="1"
            max="168"
            value={localCustomSchedule.intervalHours || ''}
            onChange={(e) => handleCustomScheduleChange('intervalHours', parseInt(e.target.value) || undefined)}
            placeholder="Ex: 6 pour toutes les 6 heures"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Laissez vide si vous utilisez les jours/heures spécifiques
          </p>
        </div>

        {/* Jours du mois */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Jours du mois
          </label>
          <div className="grid grid-cols-10 gap-1 max-h-32 overflow-y-auto">
            {customizationOptions?.monthDays.map((day) => (
              <label key={day.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localCustomSchedule.monthDays?.includes(day.value) || false}
                  onChange={(e) => {
                    const currentDays = localCustomSchedule.monthDays || [];
                    if (e.target.checked) {
                      handleCustomScheduleChange('monthDays', [...currentDays, day.value]);
                    } else {
                      handleCustomScheduleChange('monthDays', currentDays.filter(d => d !== day.value));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                  {day.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Résumé du planning */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Résumé du planning
          </h5>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            {localCustomSchedule.weekDays && localCustomSchedule.weekDays.length > 0 && (
              <p>• Jours: {localCustomSchedule.weekDays.map(d => customizationOptions?.weekDays.find(wd => wd.value === d)?.label).join(', ')}</p>
            )}
            {localCustomSchedule.hours && localCustomSchedule.hours.length > 0 && (
              <p>• Heures: {localCustomSchedule.hours.map(h => customizationOptions?.hours.find(hr => hr.value === h)?.label).join(', ')}</p>
            )}
            {localCustomSchedule.intervalHours && (
              <p>• Intervalle: Toutes les {localCustomSchedule.intervalHours} heures</p>
            )}
            {localCustomSchedule.monthDays && localCustomSchedule.monthDays.length > 0 && (
              <p>• Jours du mois: {localCustomSchedule.monthDays.join(', ')}</p>
            )}
            {Object.keys(localCustomSchedule).length === 0 && (
              <p>• Aucune configuration personnalisée définie</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélection de la période */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Période de recherche
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {periodOptions.map((periodOpt) => (
            <label
              key={periodOpt.value}
              className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                period === periodOpt.value
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="period"
                value={periodOpt.value}
                checked={period === periodOpt.value}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="sr-only"
              />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <p className={`font-medium ${
                      period === periodOpt.value
                        ? 'text-green-900 dark:text-green-100'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {periodOpt.label}
                    </p>
                    <p className={`${
                      period === periodOpt.value
                        ? 'text-green-700 dark:text-green-200'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {periodOpt.description}
                    </p>
                  </div>
                </div>
                {period === periodOpt.value && (
                  <div className="shrink-0 text-green-600">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                    </svg>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Sélection de la fréquence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Fréquence d'exécution
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {frequencies.map((freq) => (
            <label
              key={freq.value}
              className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                frequency === freq.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value={freq.value}
                checked={frequency === freq.value}
                onChange={(e) => handleFrequencyChange(e.target.value)}
                className="sr-only"
              />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <p className={`font-medium ${
                      frequency === freq.value
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {freq.label}
                    </p>
                    <p className={`${
                      frequency === freq.value
                        ? 'text-blue-700 dark:text-blue-200'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {freq.description}
                    </p>
                  </div>
                </div>
                {frequency === freq.value && (
                  <div className="shrink-0 text-blue-600">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                    </svg>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Configuration personnalisée */}
      {renderCustomScheduleForm()}

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
