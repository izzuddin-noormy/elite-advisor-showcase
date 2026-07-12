'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface MortgageCalculatorProps {
  homePrice: number;
}

const MortgageCalculator = ({ homePrice }: MortgageCalculatorProps) => {
  const [downPayment, setDownPayment] = useState(homePrice * 0.2); // 20% default
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const calculateMonthlyPayment = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    if (numPayments <= 0) {
      setMonthlyPayment(0);
    } else if (monthlyRate === 0) {
      setMonthlyPayment(principal / numPayments);
    } else {
      const monthlyPaymentCalc = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      setMonthlyPayment(monthlyPaymentCalc);
    }
  };

  useEffect(() => {
    calculateMonthlyPayment();
  }, [downPayment, loanTerm, interestRate, homePrice]);

  const formatCurrency = (amount: number) => {
    return `RM${Math.round(amount).toLocaleString('en-US')}`;
  };

  const downPaymentPercentage = (downPayment / homePrice) * 100;

  return (
    <Card className="border-0 shadow-lg sticky top-24">
      <CardHeader>
        <CardTitle className="font-serif text-xl font-light text-primary">
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Home Price */}
        <div>
          <label className="font-body text-sm font-medium text-primary block mb-2">
            Home Price
          </label>
          <p className="font-serif text-2xl font-light text-primary">
            {formatCurrency(homePrice)}
          </p>
        </div>

        {/* Down Payment Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-body text-sm font-medium text-primary">
              Down Payment
            </label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={Number.isFinite(downPaymentPercentage) ? Number(downPaymentPercentage.toFixed(1)) : 0}
                onChange={(e) => {
                  const v = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                  setDownPayment((homePrice * v) / 100);
                }}
                className="h-8 w-20 text-right text-sm"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <Slider
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
            max={homePrice}
            min={0}
            step={1000}
            className="mb-2"
          />
          <p className="font-body text-sm text-muted-foreground">
            {formatCurrency(downPayment)}
          </p>
        </div>

        {/* Loan Details */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-light text-primary">Loan Details</h3>
          
          {/* Loan Term */}
          <div>
            <label className="font-body text-sm font-medium text-primary block mb-2">
              Loan Term (Years)
            </label>
            <div className="relative">
              <Input
                type="number"
                min={1}
                max={40}
                value={Number.isFinite(loanTerm) && loanTerm > 0 ? loanTerm : ''}
                onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
                placeholder="e.g. 30"
                className="pr-14"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                years
              </span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="font-body text-sm font-medium text-primary block mb-2">
              Interest Rate
            </label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                max={15}
                min={0}
                step={0.1}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={0}
                  max={15}
                  step={0.1}
                  value={Number.isFinite(interestRate) ? interestRate : 0}
                  onChange={(e) => {
                    const v = Math.min(15, Math.max(0, parseFloat(e.target.value) || 0));
                    setInterestRate(v);
                  }}
                  className="h-8 w-20 text-right text-sm"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Payment */}
        <div className="pt-4 border-t border-border">
          <div className="text-center">
            <p className="font-body text-sm text-muted-foreground mb-1">
              Estimated Monthly Payment
            </p>
            <p className="font-serif text-3xl font-light text-primary">
              {formatCurrency(monthlyPayment)}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="font-body text-xs text-muted-foreground text-center">
          *This calculator provides an estimate only. Actual payments may vary.
        </p>
      </CardContent>
    </Card>
  );
};

export default MortgageCalculator;