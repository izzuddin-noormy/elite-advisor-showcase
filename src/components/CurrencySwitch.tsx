import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type Currency = 'USD' | 'MYR' | 'CNY';

interface CurrencySwitchProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  className?: string;
}

const CurrencySwitch = ({ currency, onCurrencyChange, className }: CurrencySwitchProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="font-body text-sm text-muted-foreground">Currency:</span>
      <Select value={currency} onValueChange={(value: Currency) => onCurrencyChange(value)}>
        <SelectTrigger className="w-20 h-8 text-xs border-primary/20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="MYR">MYR</SelectItem>
          <SelectItem value="CNY">CNY</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySwitch;