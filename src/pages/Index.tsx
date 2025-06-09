import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Results from '@/components/Results';

const Index = () => {
  const [currentRent, setCurrentRent] = useState([15000]);
  const [condoCost, setCondoCost] = useState([3000000]);
  const [condoDownpayment, setCondoDownpayment] = useState([450000]);
  const [interestRate, setInterestRate] = useState([3.5]);
  const [condoRent, setCondoRent] = useState([5000]);
  const [priceChange, setPriceChange] = useState([0]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    shouldBuy: boolean;
    isMaybe: boolean;
    monthlySavings: number;
    monthlyLoss: number;
    priceChange: number;
  } | null>(null);

  const calculateDecision = () => {
    const rental = currentRent[0];
    let downpayment = condoDownpayment[0];
    const costOfCondo = condoCost[0];

    if (downpayment < costOfCondo * (3 / 20)) {
      downpayment = costOfCondo * (3 / 20); // Ensure minimum downpayment is 15%
    }

    const condo = costOfCondo - downpayment;
    const interest = interestRate[0];
    const rent = condoRent[0];
    const priceIncrease = priceChange[0];

    const monthlyInterest = (condo * (interest / 100)) / 12;
    const totalMonthlyCost = rent + monthlyInterest;
    const monthlyAppreciation = priceIncrease > 0
      ? ((priceIncrease / 100) * condo) / 12
      : 0;

    const adjustedMonthlyCost = totalMonthlyCost - monthlyAppreciation;

    const shouldBuy = rental > adjustedMonthlyCost;
    const difference = Math.abs(rental - adjustedMonthlyCost);

    const annualBenefit = shouldBuy ? difference * 12 : 0;
    const fivePercentOfProperty = condo * 0.025;
    const isMaybe = shouldBuy && annualBenefit < fivePercentOfProperty;

    setResults({
      shouldBuy,
      isMaybe,
      monthlySavings: shouldBuy ? difference : 0,
      monthlyLoss: shouldBuy ? 0 : difference,
      priceChange: priceIncrease
    });

    setShowResults(true);
  };

  const resetCalculator = () => {
    setShowResults(false);
    setResults(null);
  };

  const clearAllValues = () => {
    setShowResults(false);
    setResults(null);
    setCurrentRent([15000]);
    setCondoCost([3000000]);
    setCondoDownpayment([450000]);
    setInterestRate([3.5]);
    setCondoRent([5000]);
    setPriceChange([0]);
  };

  // ✅ Custom handler for condo cost change
  const handleCondoCostChange = (newCostArray: number[]) => {
    const newCost = newCostArray[0];
    const minDownpayment = newCost * (3 / 20);
    const currentDown = condoDownpayment[0];

    setCondoCost(newCostArray);

    if (currentDown < minDownpayment) {
      setCondoDownpayment([minDownpayment]);
    } else if (currentDown > newCost) {
      setCondoDownpayment([newCost]);
    }
  };

  if (showResults && results) {
    return <Results results={results} onReset={resetCalculator} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            Borde jag köpa eller hyra lägenhet?
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Här får du snabbt svar!
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Current Rent */}
          <div className="space-y-4">
            <Label htmlFor="current-rent" className="text-lg font-medium">
              Vad är din nuvarande hyra?
            </Label>
            <div className="px-3">
              <Slider
                id="current-rent"
                min={0}
                max={50000}
                step={100}
                value={currentRent}
                onValueChange={setCurrentRent}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>0 kr</span>
                <span className="font-medium text-lg text-foreground">
                  {currentRent[0].toLocaleString('sv-SE')} kr
                </span>
                <span>50 000 kr</span>
              </div>
            </div>
          </div>

          {/* Condo Cost */}
          <div className="space-y-4">
            <Label htmlFor="condo-cost" className="text-lg font-medium">
              Vad är kostnaden för bostadsrätten?
            </Label>
            <div className="px-3">
              <Slider
                id="condo-cost"
                min={0}
                max={25000000}
                step={50000}
                value={condoCost}
                onValueChange={handleCondoCostChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>0 kr</span>
                <span className="font-medium text-lg text-foreground">
                  {condoCost[0].toLocaleString('sv-SE')} kr
                </span>
                <span>25 000 000 kr</span>
              </div>
            </div>
          </div>

          {/* Condo Downpayment */}
          <div className="space-y-4">
            <Label htmlFor="condo-downpayment" className="text-lg font-medium">
              Vad är din kontantinsats?
            </Label>
            <div className="px-3">
              <Slider
                id="condo-downpayment"
                min={condoCost[0] * (3 / 20)}
                max={condoCost[0]}
                step={10000}
                value={condoDownpayment}
                onValueChange={setCondoDownpayment}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{(condoCost[0] * (3 / 20)).toLocaleString('sv-SE')} kr</span>
                <span className="font-medium text-lg text-foreground">
                  {condoDownpayment[0].toLocaleString('sv-SE')} kr
                </span>
                <span>{condoCost[0].toLocaleString('sv-SE')} kr</span>
              </div>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-4">
            <Label htmlFor="interest-rate" className="text-lg font-medium">
              Vad skulle räntan vara?
            </Label>
            <div className="px-3">
              <Slider
                id="interest-rate"
                min={0}
                max={10}
                step={0.1}
                value={interestRate}
                onValueChange={setInterestRate}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>0%</span>
                <span className="font-medium text-lg text-foreground">
                  {interestRate[0].toFixed(1)}%
                </span>
                <span>10%</span>
              </div>
            </div>
          </div>

          {/* Condo Rent */}
          <div className="space-y-4">
            <Label htmlFor="condo-rent" className="text-lg font-medium">
              Vad skulle månadsavgiften vara för bostadsrätten?
            </Label>
            <div className="px-3">
              <Slider
                id="condo-rent"
                min={0}
                max={50000}
                step={100}
                value={condoRent}
                onValueChange={setCondoRent}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>0 kr</span>
                <span className="font-medium text-lg text-foreground">
                  {condoRent[0].toLocaleString('sv-SE')} kr
                </span>
                <span>50 000 kr</span>
              </div>
            </div>
          </div>

          {/* Price Change */}
          <div className="space-y-4">
            <Label htmlFor="price-change" className="text-lg font-medium">
              Vad är prisförändringen de senaste 36 månaderna för alla lägenheter i detta område?
            </Label>
            <div className="px-3">
              <Slider
                id="price-change"
                min={-100}
                max={100}
                step={0.1}
                value={priceChange}
                onValueChange={setPriceChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>-100%</span>
                <span className="font-medium text-lg text-foreground">
                  {priceChange[0] > 0 ? '+' : ''}
                  {priceChange[0].toFixed(1)}%
                </span>
                <span>+100%</span>
              </div>
              <Alert>
                <AlertDescription className="text-sm">
                  💡 Tips: Gå ut på annonsen av bostaden på Hemnet och skrolla längst ner för att se prisutveckling, filtrera på 36 månader. Lämna 0% om du inte vill spekulera prisförändring
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={calculateDecision}
              className="flex-1 h-14 text-lg font-semibold"
              size="lg"
            >
              Beräkna Rekommendation
            </Button>
            <Button
              onClick={clearAllValues}
              variant="outline"
              className="h-14 text-lg"
              size="lg"
            >
              Rensa Allt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
