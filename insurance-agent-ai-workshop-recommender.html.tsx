import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AIWorkshopRecommender = () => {
  const [experience, setExperience] = useState('');
  const [clientCount, setClientCount] = useState('');
  const [productTypes, setProductTypes] = useState([]);
  const [usageGoals, setUsageGoals] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const productOptions = [
    { id: 'life', label: 'ביטוח חיים' },
    { id: 'health', label: 'ביטוח בריאות' },
    { id: 'car', label: 'ביטוח רכב' },
    { id: 'home', label: 'ביטוח דירה' },
    { id: 'business', label: 'ביטוח עסקי' },
    { id: 'liability', label: 'ביטוח אחריות מקצועית' },
    { id: 'risk', label: 'סיכונים' },
    { id: 'pension', label: 'פנסיה' },
    { id: 'savings', label: 'חיסכון' }
  ];

  const usageOptions = [
    { id: 'marketing', label: 'שיווק' },
    { id: 'service', label: 'שירות' },
    { id: 'operations', label: 'תפעול' }
  ];

  const generateRecommendation = () => {
    let workshopType = '';
    let tools = [];

    if (parseInt(experience) < 5) {
      workshopType = 'סדנא בסיסית למתחילים';
    } else if (parseInt(experience) < 10) {
      workshopType = 'סדנא מתקדמת לבעלי ניסיון';
    } else {
      workshopType = 'סדנא מקצועית למומחים';
    }

    if (usageGoals.includes('שיווק')) {
      tools.push('כלי ניתוח שוק', 'מערכות CRM מתקדמות');
    }
    if (usageGoals.includes('שירות')) {
      tools.push('צ\'אטבוטים לשירות לקוחות', 'מערכות ניהול פניות חכמות');
    }
    if (usageGoals.includes('תפעול')) {
      tools.push('כלי אוטומציה לתהליכים', 'מערכות ניהול מסמכים חכמות');
    }

    if (parseInt(clientCount) > 1000) {
      tools.push('מערכות ניהול לקוחות בקנה מידה גדול');
    }

    if (productTypes.length > 2) {
      tools.push('כלי אינטגרציה למוצרים מרובים');
    }
    if (productTypes.includes('סיכונים')) {
      tools.push('כלי ניתוח סיכונים מתקדמים');
    }
    if (productTypes.includes('פנסיה') || productTypes.includes('חיסכון')) {
      tools.push('מערכות תכנון פיננסי ארוך טווח');
    }

    setRecommendation(`אנו ממליצים על ${workshopType}. 
    הכלים המומלצים ללמידה: ${tools.join(', ')}.`);
  };

  const submitLead = async () => {
    if (!agentName || !agentPhone || !agentEmail) {
      setErrorMessage('נא למלא את כל השדות');
      return;
    }

    setErrorMessage('');
    
    const webhookUrl = 'https://hook.eu1.make.com/jq30tqzj467p7as4s28slrsr1yc4w4nw';
    
    const data = {
      experience,
      clientCount,
      productTypes,
      usageGoals,
      recommendation,
      agentName,
      agentPhone,
      agentEmail
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('נתונים נשלחו בהצלחה לוובהוק');
        setLeadSubmitted(true);
        setAgentName('');
        setAgentPhone('');
        setAgentEmail('');
        alert('תודה על השארת הפרטים! נציג יצור איתך קשר בקרוב.');
      } else {
        console.error('שגיאה בשליחת נתונים לוובהוק');
        setErrorMessage('אירעה שגיאה בשליחת הפרטים. נא לנסות שוב מאוחר יותר.');
      }
    } catch (error) {
      console.error('שגיאה:', error);
      setErrorMessage('אירעה שגיאה בשליחת הפרטים. נא לנסות שוב מאוחר יותר.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>מחולל המלצות לסדנאות AI לסוכני ביטוח</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="experience">ותק בענף (בשנים)</Label>
            <Input
              id="experience"
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientCount">כמות לקוחות</Label>
            <Input
              id="clientCount"
              type="number"
              value={clientCount}
              onChange={(e) => setClientCount(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>סוגי מוצרים</Label>
            <div className="flex flex-wrap gap-2">
              {productOptions.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={product.id}
                    checked={productTypes.includes(product.label)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setProductTypes([...productTypes, product.label]);
                      } else {
                        setProductTypes(productTypes.filter(type => type !== product.label));
                      }
                    }}
                  />
                  <Label htmlFor={product.id}>{product.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>מטרת השימוש</Label>
            <div className="flex flex-wrap gap-2">
              {usageOptions.map((usage) => (
                <div key={usage.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={usage.id}
                    checked={usageGoals.includes(usage.label)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setUsageGoals([...usageGoals, usage.label]);
                      } else {
                        setUsageGoals(usageGoals.filter(goal => goal !== usage.label));
                      }
                    }}
                  />
                  <Label htmlFor={usage.id}>{usage.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Button onClick={generateRecommendation}>צור המלצה</Button>
          
          {recommendation && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-bold mb-2">ההמלצה שלנו:</h3>
              <p>{recommendation}</p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <h3 className="font-bold">השאר פרטים לקבלת מידע נוסף</h3>
            <div className="space-y-2">
              <Label htmlFor="agentName">שם הסוכן</Label>
              <Input
                id="agentName"
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentPhone">טלפון</Label>
              <Input
                id="agentPhone"
                type="tel"
                value={agentPhone}
                onChange={(e) => setAgentPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentEmail">אימייל</Label>
              <Input
                id="agentEmail"
                type="email"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
              />
            </div>
            <Button onClick={submitLead}>שלח פרטים</Button>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>שגיאה</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {leadSubmitted && (
            <Alert className="mt-4">
              <AlertTitle>תודה!</AlertTitle>
              <AlertDescription>
                פרטיך נשלחו בהצלחה. ניצור איתך קשר בקרוב.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <h3 className="font-bold mb-2">יצירת קשר</h3>
        <p>ירדן פלד</p>
        <p>מומחה לאוטומציה מבוססת בינה מלאכותית בענף הביטוח</p>
      </CardFooter>
    </Card>
  );
};

export default AIWorkshopRecommender;
