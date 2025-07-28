import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    
    if (monthlyRate === 0) {
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
            <span className="font-body text-sm text-muted-foreground">
              {downPaymentPercentage.toFixed(1)}%
            </span>
          </div>
          <Slider
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
            max={homePrice * 0.5}
            min={homePrice * 0.05}
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
              Loan Type
            </label>
            <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Year Fixed</SelectItem>
                <SelectItem value="15">15 Year Fixed</SelectItem>
                <SelectItem value="20">20 Year Fixed</SelectItem>
                <SelectItem value="30">30 Year Fixed</SelectItem>
              </SelectContent>
            </Select>
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
                max={10}
                min={3}
                step={0.1}
                className="flex-1"
              />
              <span className="font-body text-sm text-muted-foreground w-12 text-right">
                {interestRate.toFixed(1)}%
              </span>
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