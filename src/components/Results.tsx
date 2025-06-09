
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Calculator } from 'lucide-react';

interface ResultsProps {
  results: {
    shouldBuy: boolean;
    isMaybe: boolean;
    monthlySavings: number;
    monthlyLoss: number;
    priceChange: number;
  };
  onReset: () => void;
}

const Results = ({ results, onReset }: ResultsProps) => {
  const { shouldBuy, isMaybe, monthlySavings, monthlyLoss, priceChange } = results;

  const getDecision = () => {
    if (isMaybe) return 'maybe';
    return shouldBuy ? 'yes' : 'no';
  };

  const decision = getDecision();
  const considerFuture = priceChange < -3 ? "yes" : "no";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            {decision === 'yes' ? (
              <CheckCircle className="w-20 h-20 text-green-500" />
            ) : decision === 'maybe' ? (
              <AlertCircle className="w-20 h-20 text-yellow-500" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500" />
            )}
          </div>
          <CardTitle className={`text-4xl font-bold mb-4 ${
            decision === 'yes' ? 'text-green-600' : 
            decision === 'maybe' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {decision === 'yes' ? 'JA! Du bör köpa' : 
             decision === 'maybe' ? 'KANSKE - fundera noga' : 
             'NEJ! Bo kvar i hyresrätt och fortsätt spara'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div className={`p-6 rounded-lg ${
            decision === 'yes' ? 'bg-green-50 border border-green-200' : 
            decision === 'maybe' ? 'bg-yellow-50 border border-yellow-200' : 
            'bg-red-50 border border-red-200'
          }`}>
            {decision === 'yes' ? (
              <div>
                <h3 className="text-2xl font-semibold text-green-800 mb-2">
                  Månadsbesparing
                </h3>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {monthlySavings.toLocaleString('sv-SE')} kr
                </p>
                <p className="text-green-700">
                  Genom att köpa bostadsrätten sparar du cirka {monthlySavings.toLocaleString('sv-SE')} kr per månad jämfört med din nuvarande hyressituation om bostadspriserna fortsätter öka med {priceChange.toFixed(2)}% över dom kommande 3 åren.
                </p>
                <p className="text-green-700 mt-2">
                  Årsbesparing: {(monthlySavings * 12).toLocaleString('sv-SE')} kr
                </p>
              </div>
            ) : decision === 'maybe' ? (
              <div>
                <h3 className="text-2xl font-semibold text-yellow-800 mb-2">
                  Liten månadsbesparing
                </h3>
                <p className="text-3xl font-bold text-yellow-600 mb-2">
                  {monthlySavings.toLocaleString('sv-SE')} kr
                </p>
                <p className="text-yellow-700">
                  Även om köp skulle spara dig {monthlySavings.toLocaleString('sv-SE')} kr per månad, är årsvinsten mindre än 2.5% av fastighetskostnaden.
                </p>
                <p className="text-yellow-700 mt-2">
                  Tänk på att fastighetsägande normalt kräver mellan 1 - 4% årligen för underhåll och reparationer som annars skulle täckas av din hyresvärd.
                </p>
                <p className="text-yellow-700 mt-2">
                  Årsbesparing: {(monthlySavings * 12).toLocaleString('sv-SE')} kr
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold text-red-800 mb-2">
                  Förlust per månad
                </h3>
                <p className="text-3xl font-bold text-red-600 mb-2">
                  {monthlyLoss.toLocaleString('sv-SE')} kr
                </p>
                <p className="text-red-700">
                  Att köpa bostadsrätten skulle kosta dig cirka {monthlyLoss.toLocaleString('sv-SE')} kr mer per månad än din nuvarande hyra.
                </p>
                <p className="text-red-700 mt-2">
                  Årlig förlust: {(monthlyLoss * 12).toLocaleString('sv-SE')} kr
                </p>
                {considerFuture === 'yes' && (
                  <p className="text-red-700 mt-2"> 
                    Eftersom bostadspriserna har minskat med {priceChange.toFixed(2)}% det senaste året så kan man spekulera att priserna går upp i när framtid vilket du borde överväga i ditt beslut
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Denna beräkning inkluderar månadsavgifter för bostadsrätt, räntekostnader och potentiell värdeökning baserat på historisk data. Kom ihåg att lån alltid innebär en risk
            </p>
          </div>

          <Button 
            onClick={onReset}
            variant="outline"
            className="w-full h-12 text-lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Beräkna igen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
